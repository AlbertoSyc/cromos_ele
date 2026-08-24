import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }: { message: string }) {
  return <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-800">
    <AlertCircle className="mt-0.5 shrink-0" size={20} />
    <span>{message}</span>
  </div>;
}