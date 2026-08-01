"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PrioridadeBadge, TipoBadge } from "./projeto-labels";
import { ProgressBar } from "./progress-bar";
import type { Projeto, ProfileOption } from "./types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function isOverdue(projeto: Pick<Projeto, "prazo" | "status">) {
  if (!projeto.prazo || projeto.status === "concluido") return false;
  return new Date(`${projeto.prazo}T23:59:59`) < new Date();
}

export function ProjetoCard({
  projeto,
  clienteNome,
  equipeProfiles,
  onClick,
  draggable = true,
}: {
  projeto: Projeto;
  clienteNome?: string;
  equipeProfiles: ProfileOption[];
  onClick: () => void;
  draggable?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: projeto.id,
    disabled: !draggable,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const overdue = isOverdue(projeto);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      onClick={onClick}
      className={cn(
        "mb-2.5 cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5",
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "z-10 opacity-40"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="truncate text-[13px] font-semibold text-white">{projeto.nome}</div>
        <PrioridadeBadge prioridade={projeto.prioridade} />
      </div>
      <div className="mb-2 text-[11.5px] text-slate">{clienteNome ?? "Sem cliente vinculado"}</div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <TipoBadge tipo={projeto.tipo} />
      </div>
      <div className="mb-2.5 flex items-center justify-between">
        <ProgressBar value={projeto.progresso} className="mr-2 flex-1" />
        <span className="text-[10.5px] text-slate-dim">{projeto.progresso}%</span>
      </div>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1 text-[11px]",
            overdue ? "font-semibold text-red-400" : "text-slate-dim"
          )}
        >
          {overdue ? <AlertTriangle size={11} /> : <CalendarDays size={11} />}
          {projeto.prazo ? new Date(`${projeto.prazo}T00:00:00`).toLocaleDateString("pt-BR") : "Sem prazo"}
        </div>
        {equipeProfiles.length > 0 && (
          <div className="flex -space-x-1.5">
            {equipeProfiles.slice(0, 3).map((p) => (
              <Avatar key={p.id} className="h-5 w-5 border border-card">
                <AvatarFallback className="text-[9px]">{initials(p.nome)}</AvatarFallback>
              </Avatar>
            ))}
            {equipeProfiles.length > 3 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-card bg-white/10 text-[9px] font-semibold text-white">
                +{equipeProfiles.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
