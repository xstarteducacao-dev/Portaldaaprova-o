"use client";

import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ProjetoKanbanColumn } from "./kanban-column";
import { PROJETO_KANBAN_COLUMNS } from "./kanban-columns";
import type { EmpresaOption, ProfileOption, Projeto } from "./types";
import type { StatusProjeto } from "@/types/database.types";

export function ProjetoKanbanView({
  projetos,
  empresas,
  profiles,
  onProjetoClick,
  onStatusChange,
}: {
  projetos: Projeto[];
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  onProjetoClick: (projeto: Projeto) => void;
  onStatusChange: (id: string, status: StatusProjeto) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const projetoId = active.id as string;
    const newStatus = over.id as StatusProjeto;
    const projeto = projetos.find((p) => p.id === projetoId);
    if (!projeto || projeto.status === newStatus) return;

    const previousStatus = projeto.status;
    onStatusChange(projetoId, newStatus);

    const supabase = createClient();
    const { error } = await supabase.from("projetos").update({ status: newStatus }).eq("id", projetoId);

    if (error) {
      onStatusChange(projetoId, previousStatus);
      toast.error("Não foi possível mover o projeto", { description: error.message });
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="mt-5 flex gap-3.5 overflow-x-auto pb-3.5">
        {PROJETO_KANBAN_COLUMNS.map((col) => (
          <ProjetoKanbanColumn
            key={col.status}
            column={col}
            projetos={projetos.filter((p) => p.status === col.status)}
            empresas={empresas}
            profiles={profiles}
            onProjetoClick={onProjetoClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
