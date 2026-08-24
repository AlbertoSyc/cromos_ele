# Gestor de cromos — Hello Kitty and Friends

Aplicación React + Vite + Tailwind CSS para gestionar cantidades de una colección de cromos. El frontend se publica en GitHub Pages y el backend serverless en Vercel. Los perfiles se guardan como JSON dentro de `profiles/` en el repositorio.

> **Importante sobre seguridad:** el identificador `Perfil` no es una contraseña. Si alguien conoce un Perfil válido puede consultar/modificar sus datos. El token de GitHub sí permanece exclusivamente en Vercel. Si necesitas privacidad real por usuario, añade autenticación (por ejemplo, código secreto por Perfil) antes de usar la aplicación con datos que deban ser privados.

## 1. Requisitos

- Node.js 20+
- Un repositorio GitHub
- Una cuenta Vercel para la API
- Un GitHub fine-grained Personal Access Token con acceso al repositorio y permiso de **Contents: Read and write**
- Un catálogo real de cromos y sus imágenes, si se quiere sustituir los placeholders.

## 2. Catálogo

El catálogo está separado de la lógica en:

`src/data/cards.json`

Los tres elementos incluidos son **solo ejemplos técnicos**. Las imágenes de `public/images/cards/` son placeholders y no representan cromos oficiales.

Para usar el catálogo real:
1. Sustituye el contenido de `src/data/cards.json`.
2. Añade las imágenes reales en `public/images/cards/`.
3. Comprueba que cada `image` apunta a la ruta correcta.
4. No inventes nombres, números o imágenes si no dispones de la información real.

## 3. Instalación local

```bash
npm install
npm run dev
```

Para comprobar tipos:

```bash
npm run check
```

Build:

```bash
npm run build
npm run preview
```

## 4. Backend Vercel

Este repositorio contiene la función:

`api/profile.ts`

En Vercel, configura el proyecto para desplegar el repositorio. Añade estas variables de entorno:

```text
GITHUB_TOKEN=...
GITHUB_OWNER=...
GITHUB_REPOSITORY=...
GITHUB_BRANCH=main
ALLOWED_ORIGIN=https://TU-USUARIO.github.io
```

`GITHUB_TOKEN` nunca debe empezar por `VITE_` y nunca debe estar en el código del frontend.

La función utiliza GitHub Contents API:
- `GET /api/profile?profile=JUAN`
- `PUT /api/profile` con `{ "profile": "JUAN", "cardId": "001", "quantity": 2 }`

Al guardar:
1. El backend obtiene el JSON actual y su SHA.
2. Cambia únicamente el cromo solicitado.
3. Hace commit con el SHA.
4. Si hay conflicto de concurrencia, vuelve a leer y reintenta hasta tres veces.

## 5. Crear el token de GitHub

Recomendado: **fine-grained Personal Access Token**.

Concede acceso únicamente al repositorio que contiene esta aplicación y el permiso:

- Repository permissions → Contents → Read and write

No incluyas el token en:
- `src/`
- `public/`
- `VITE_*`
- GitHub Pages
- `cards.json`
- commits
- README

## 6. GitHub Pages

El workflow `.github/workflows/deploy.yml` genera el frontend y lo publica en GitHub Pages.

En GitHub:
1. Sube el proyecto al repositorio.
2. Ve a Settings → Pages.
3. Selecciona **GitHub Actions** como fuente.
4. En Settings → Secrets and variables → Actions → Variables crea:
   - `VITE_API_BASE_URL` = URL de la aplicación Vercel.
5. Haz push a `main`.
6. GitHub Actions ejecutará `npm ci`, `npm run build` y publicará `dist`.

El workflow calcula automáticamente la base para un repositorio de tipo `usuario.github.io/repositorio`.

## 7. Perfiles

Un perfil existente tiene esta forma:

```json
{
  "profile": "DEMO",
  "cards": {
    "001": 1,
    "002": 2,
    "003": 0
  }
}
```

Para crear perfiles válidos inicialmente, añade manualmente sus archivos en:

`profiles/PERFIL.json`

La aplicación **no crea perfiles automáticamente**.

El archivo `profiles/DEMO.json` es un ejemplo técnico y debe eliminarse o sustituirse antes de producción.

## 8. API y CORS

`ALLOWED_ORIGIN` debe ser la URL exacta del frontend de producción. Para pruebas locales puedes usar temporalmente:

```text
ALLOWED_ORIGIN=http://localhost:5173
```

No uses `*` en producción si quieres restringir el origen.

## 9. Experiencia

- Inicio: estadísticas calculadas desde el catálogo y el perfil.
- Cromos: grid tipo catálogo/ecommerce.
- Repetidos: únicamente cromos con cantidad > 1.
- `-` nunca baja de 0.
- `0 → 1` dispara una animación ligera de estrellitas.
- El guardado es remoto; `localStorage` solo conserva la sesión/último Perfil.
- La navegación inferior contiene exactamente Inicio, Cromos y Repetidos.
- Diseño mobile-first y responsive.

## 10. Estructura

```text
.
├── api/
│   └── profile.ts
├── public/
│   └── images/cards/
├── profiles/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── .github/workflows/deploy.yml
├── .env.example
├── package.json
├── tailwind.config.js
├── vercel.json
└── vite.config.ts
```

## 11. Cambio de Perfil

El botón **Cambiar Perfil** elimina la sesión local y devuelve a la pantalla de acceso. No elimina el archivo remoto.

## 12. Limitación importante del modelo de Perfil

El requisito original define Perfil como identificador, pero no como secreto. Por tanto, no puede considerarse autenticación. Para una aplicación doméstica puede ser suficiente; para proteger datos frente a terceros habría que añadir un mecanismo de autenticación.

## 13. Validación requisito por requisito

| Requisito | Estado | Implementación |
|---|---|---|
| Solicita Perfil al acceder | ✅ | `LoginPage` |
| Comprueba que existe | ✅ | `GET /api/profile` |
| Perfil inexistente: error y permanece en inicio | ✅ | HTTP 404 |
| Fichero independiente por Perfil | ✅ | `profiles/PERFIL.json` |
| Guardar cantidades | ✅ | `PUT /api/profile` |
| Recuperar cantidades | ✅ | GET + JSON |
| Menú inferior | ✅ | `BottomNavigation` |
| Inicio | ✅ | `HomePage` |
| Cromos | ✅ | `CardsPage` |
| Repetidos | ✅ | `DuplicatesPage` |
| Diseño ecommerce | ✅ | `CardItem` + grid responsive |
| Imagen por cromo | ⚠️ | Placeholder hasta incorporar imágenes reales |
| Número | ✅ | `cards.json` |
| `- cantidad +` | ✅ | `QuantitySelector` |
| Nombre | ✅ | Procede del catálogo |
| Cantidades negativas | ✅ | Bloqueadas |
| Repetidos > 1 | ✅ | Filtrado dinámico |
| Editar repetidos | ✅ | Mismo estado |
| 0 → 1: estrellitas | ✅ | CSS + `CelebrationAnimation` |
| Guardado en GitHub | ✅ | GitHub Contents API |
| Token fuera del frontend | ✅ | Secret Vercel |
| Backend serverless | ✅ | Vercel Function |
| Tailwind CSS | ✅ | Tailwind 3 |
| Google Fonts | ✅ | Nunito |
| Responsive | ✅ | Mobile-first |
| README | ✅ | Este documento |
| Despliegue | ✅ | GitHub Actions + Pages |
| Catálogo separado | ✅ | `src/data/cards.json` |
| No inventar colección | ✅ | Solo placeholders explícitos |
| Errores de red | ✅ | Estados y mensajes |
| Estados de carga | ✅ | Login + guardado |
| Cambiar Perfil | ✅ | Logout local |

### Punto que no puede cumplirse literalmente sin datos externos

El requisito de mostrar **imágenes reales de todos los cromos** no puede completarse con el archivo de requisitos porque no contiene el catálogo ni las imágenes reales. La solución deja la arquitectura preparada y usa placeholders claramente etiquetados. Esto evita presentar contenido inventado como oficial.

### Punto de seguridad que requiere conocer la limitación

El token está protegido, pero `Perfil` por sí solo no autentica a una persona. Esto es una consecuencia del modelo funcional solicitado. La API valida estrictamente el identificador y el path, pero no puede saber si quien conoce `JUAN` es realmente JUAN. Para privacidad real, hay que añadir autenticación.
