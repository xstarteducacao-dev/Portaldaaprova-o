"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { LeadCard, type Lead } from "./lead-card";
import type { KanbanColumnDef } from "./kanban-columns";

export function KanbanColumn({
  column,
  leads,
  onLeadClick,
}: {
  column: KanbanColumnDef;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  return (
    <div className="w-[260px] min-w-[260px] flex-shrink-0">
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full" style={{ background: column.color }} />
        <span className="text-[12.5px] font-semibold text-white">{column.title}</span>
        <span className="ml-auto text-[11px] text-slate-dim">{leads.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[120px] rounded-[14px] border border-white/[0.08] bg-white/[0.015] p-2.5 transition-colors",
          isOver && "border-accent/50 bg-accent/[0.04]"
        )}
      >
        {leads.length === 0 ? (
          <div className="py-4 text-center text-[11.5px] text-slate-dim">Nenhum lead</div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />)
        )}
      </div>
    </div>
  );
}
