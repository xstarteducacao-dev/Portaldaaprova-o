"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MapPin } from "lucide-react";
import type { Database } from "@/types/database.types";
import { cn } from "@/lib/utils";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "mb-2.5 cursor-grab rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 active:cursor-grabbing",
        isDragging && "z-10 opacity-40"
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal to-accent text-[10.5px] font-bold text-[#04101f]">
          {initials(lead.empresa_nome).toUpperCase() || "L"}
        </div>
        <div className="truncate text-[13px] font-semibold text-white">{lead.empresa_nome}</div>
      </div>
      <div className="mb-1 text-[11.5px] text-slate">{lead.responsavel}</div>
      {(lead.cidade || lead.uf) && (
        <div className="mb-2 flex items-center gap-1 text-[11px] text-slate-dim">
          <MapPin size={11} />
          {[lead.cidade, lead.uf].filter(Boolean).join(" / ")}
        </div>
      )}
      {lead.segmento && (
        <span className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[10.5px] font-semibold text-accent">
          {lead.segmento}
        </span>
      )}
    </div>
  );
}
