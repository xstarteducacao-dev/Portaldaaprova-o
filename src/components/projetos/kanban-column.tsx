"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ProjetoCard } from "./projeto-card";
import type { ProjetoKanbanColumnDef } from "./kanban-columns";
import type { Projeto, ProfileOption, EmpresaOption } from "./types";

export function ProjetoKanbanColumn({
  column,
  projetos,
  empresas,
  profiles,
  onProjetoClick,
}: {
  column: ProjetoKanbanColumnDef;
  projetos: Projeto[];
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  onProjetoClick: (projeto: Projeto) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });
  const empresaMap = new Map(empresas.map((e) => [e.id, e.nome]));
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  return (
    <div className="w-[280px] min-w-[280px] flex-shrink-0">
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full" style={{ background: column.color }} />
        <span className="text-[12.5px] font-semibold text-white">{column.title}</span>
        <span className="ml-auto text-[11px] text-slate-dim">{projetos.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[120px] rounded-[14px] border border-white/[0.08] bg-white/[0.015] p-2.5 transition-colors",
          isOver && "border-accent/50 bg-accent/[0.04]"
        )}
      >
        {projetos.length === 0 ? (
          <div className="py-4 text-center text-[11.5px] text-slate-dim">Nenhum projeto</div>
        ) : (
          projetos.map((projeto) => (
            <ProjetoCard
              key={projeto.id}
              projeto={projeto}
              clienteNome={projeto.cliente_id ? empresaMap.get(projeto.cliente_id) : undefined}
              equipeProfiles={projeto.equipe.map((id) => profileMap.get(id)).filter(Boolean) as ProfileOption[]}
              onClick={() => onProjetoClick(projeto)}
            />
          ))
        )}
      </div>
    </div>
  );
}
