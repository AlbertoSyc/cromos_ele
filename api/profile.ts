import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROFILE_RE = /^[A-Za-z0-9_-]{1,40}$/;
const CARD_RE = /^\d{1,10}$/;
const MAX_QUANTITY = 999;

function config() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPOSITORY, GITHUB_BRANCH = 'main', ALLOWED_ORIGIN = '*' } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPOSITORY) {
    throw new Error('Backend GitHub configuration is incomplete.');
  }
  return { token: GITHUB_TOKEN, owner: GITHUB_OWNER, repo: GITHUB_REPOSITORY, branch: GITHUB_BRANCH, origin: ALLOWED_ORIGIN };
}

function normalizeProfile(value: unknown) {
  if (typeof value !== 'string') return null;
  const profile = value.trim().toUpperCase();
  return PROFILE_RE.test(profile) ? profile : null;
}

function pathFor(profile: string) {
  return `profiles/${profile}.json`;
}

function headers(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function github(url: string, init: RequestInit = {}) {
  const cfg = config();
  const response = await fetch(url, {
    ...init,
    headers: { ...headers(cfg.token), ...(init.headers || {}) },
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

function setCors(res: VercelResponse, origin: string) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function decodeContent(data: any) {
  if (!data?.content) return null;
  return JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let cfg;
  try { cfg = config(); } catch {
    return res.status(500).json({ error: 'Backend no configurado correctamente.' });
  }
  setCors(res, cfg.origin);

  if (req.method === 'OPTIONS') return res.status(204).end();

  const rawProfile = req.method === 'GET' ? req.query.profile : req.body?.profile;
  const profile = normalizeProfile(rawProfile);
  if (!profile) return res.status(400).json({ error: 'Perfil no válido.' });

  const url = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${pathFor(profile)}?ref=${encodeURIComponent(cfg.branch)}`;

  if (req.method === 'GET') {
    const result = await github(url);
    if (result.response.status === 404) return res.status(404).json({ error: 'El Perfil introducido no existe.' });
    if (!result.response.ok) return res.status(502).json({ error: 'No se ha podido consultar el perfil.' });

    try {
      const data = decodeContent(result.data);
      if (!data || data.profile !== profile || typeof data.cards !== 'object') {
        return res.status(502).json({ error: 'El fichero del perfil no tiene un formato válido.' });
      }
      return res.status(200).json({ profile, cards: data.cards });
    } catch {
      return res.status(502).json({ error: 'No se ha podido leer el fichero del perfil.' });
    }
  }

  if (req.method !== 'PUT') return res.status(405).json({ error: 'Método no permitido.' });

  const body = req.body || {};
  const cardId = typeof body.cardId === 'string' ? body.cardId : '';
  const quantity = Number(body.quantity);
  if (!CARD_RE.test(cardId) || !Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) {
    return res.status(400).json({ error: 'Cromo o cantidad no válidos.' });
  }

  // Retry after a SHA conflict. Because the request changes only one card,
  // refetching and applying the same operation preserves other users' updates.
  for (let attempt = 0; attempt < 3; attempt++) {
    const current = await github(url);
    if (current.response.status === 404) return res.status(404).json({ error: 'El Perfil introducido no existe.' });
    if (!current.response.ok) return res.status(502).json({ error: 'No se ha podido leer el perfil para guardar.' });

    let profileData;
    try { profileData = decodeContent(current.data); } catch {
      return res.status(502).json({ error: 'El fichero del perfil no tiene un formato válido.' });
    }
    if (!profileData || profileData.profile !== profile || typeof profileData.cards !== 'object') {
      return res.status(502).json({ error: 'El fichero del perfil no tiene un formato válido.' });
    }

    profileData.cards[cardId] = quantity;
    const content = Buffer.from(JSON.stringify({
      profile,
      cards: profileData.cards,
    }, null, 2) + '\n').toString('base64');

    const commitUrl = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${pathFor(profile)}`;
    const commit = await github(commitUrl, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Update profile ${profile}`,
        content,
        branch: cfg.branch,
        sha: current.data.sha,
      }),
    });

    if (commit.response.ok) return res.status(200).json({ profile, cards: profileData.cards });
    if (commit.response.status !== 409) {
      return res.status(502).json({ error: 'No se han podido guardar los cambios.' });
    }
  }

  return res.status(409).json({ error: 'El perfil ha cambiado simultáneamente. Vuelve a intentarlo.' });
}