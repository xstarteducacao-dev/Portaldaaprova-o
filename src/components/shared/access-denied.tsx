import { ShieldAlert } from "lucide-react";

export function AccessDenied({
  description = "Você não tem permissão para acessar esta página.",
}: {
  description?: string;
}) {
  return (
    <div className="flex h-[65vh] flex-col items-center justify-center text-center">
      <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08]">
        <ShieldAlert className="h-6 w-6 text-red-400" />
      </div>
      <h2 className="mb-1.5 font-display text-[19px] text-white">Acesso restrito</h2>
      <p className="max-w-[340px] text-[13.5px] text-slate">{description}</p>
    </div>
  );
}
