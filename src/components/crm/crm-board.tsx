"use client";

import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { KanbanColumn } from "./kanban-column";
import { KANBAN_COLUMNS } from "./kanban-columns";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { NewLeadDialog } from "./new-lead-dialog";
import type { Lead } from "./lead-card";
import type { StatusLead } from "@/types/database.types";

export function CrmBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (error) {
          toast.error("Não foi possível carregar os leads", { description: error.message });
        } else {
          setLeads((data as Lead[]) ?? []);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLeadClick(lead: Lead) {
    setSelectedLead(lead);
    setSheetOpen(true);
  }

  function handleCreated(lead: Lead) {
    setLeads((prev) => [lead, ...prev]);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as StatusLead;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    const previousStatus = lead.status;
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const supabase = createClient();
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);

    if (error) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: previousStatus } : l)));
      toast.error("Não foi possível mover o lead", { description: error.message });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">CRM</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Arraste os cards entre as colunas para atualizar o status.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus size={15} />
          Novo lead
        </Button>
      </div>

      {loading ? (
        <div className="mt-5 flex gap-3.5 overflow-x-auto pb-3.5">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.status} className="w-[260px] min-w-[260px] flex-shrink-0 space-y-2.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="mt-5 flex gap-3.5 overflow-x-auto pb-3.5">
            {KANBAN_COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                column={col}
                leads={leads.filter((l) => l.status === col.status)}
                onLeadClick={handleLeadClick}
              />
            ))}
          </div>
        </DndContext>
      )}

      <LeadDetailSheet lead={selectedLead} open={sheetOpen} onOpenChange={setSheetOpen} />
      <NewLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={handleCreated} />
    </div>
  );
}
