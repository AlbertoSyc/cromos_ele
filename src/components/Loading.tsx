export default function Loading({ text = 'Cargando...' }: { text?: string }) {
  return <div className="flex min-h-[45vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-pink-700">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />
      <span className="font-bold">{text}</span>
    </div>
  </div>;
}