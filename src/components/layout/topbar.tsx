import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

const PERFIL_LABEL: Record<string, string> = {
  administrador: "Administrador",
  gerente: "Gerente",
  consultor: "Consultor",
  comercial: "Comercial",
  financeiro: "Financeiro",
  marketing: "Marketing",
  desenvolvedor: "Desenvolvedor",
};

export function Topbar({ nome, perfil }: { nome: string; perfil: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-[68px] flex-shrink-0 items-center justify-between border-b border-white/[0.08] bg-[rgba(5,8,22,.85)] px-5 backdrop-blur-md md:px-7">
      <div className="relative w-[320px] max-w-[40vw]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-dim" />
        <input
          placeholder="Buscar empresas, leads, projetos..."
          className="w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3.5 text-[13px] text-white outline-none placeholder:text-slate-dim"
        />
      </div>
      <div className="flex items-center gap-4 md:gap-[18px]">
        <button aria-label="Notificações" className="relative text-slate hover:text-white">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full bg-accent" />
        </button>
        <div className="hidden h-6 w-px bg-white/[0.08] md:block" />
        <div className="flex items-center gap-2.5">
          <Avatar className="h-[34px] w-[34px]">
            <AvatarFallback>{initials(nome).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-[13px] font-semibold text-white">{nome}</div>
            <div className="text-[11px] text-slate-dim">
              {PERFIL_LABEL[perfil] ?? perfil}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
