"use client";

import { useState } from "react";
import { LayoutGrid, List, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProjetoKanbanView } from "./projeto-kanban-view";
import { ProjetoListaView } from "./projeto-lista-view";
import { ProjetoCalendarioView } from "./projeto-calendario-view";
import { ProjetoFormDialog } from "./projeto-form-dialog";
import { ProjetoDetailSheet } from "./projeto-detail-sheet";
import { PROJETO_KANBAN_COLUMNS } from "./kanban-columns";
import type { EmpresaOption, ProfileOption, Projeto } from "./types";
import type { StatusProjeto } from "@/types/database.types";

type ViewMode = "kanban" | "lista" | "calendario";

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { mode: "kanban", label: "Kanban", icon: LayoutGrid },
  { mode: "lista", label: "Lista", icon: List },
  { mode: "calendario", label: "Calendário", icon: Calendar },
];

export function ProjetosView({
  initialProjetos,
  empresas,
  profiles,
  currentUser,
}: {
  initialProjetos: Projeto[];
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  currentUser: { id: string; nome: string };
}) {
  const [projetos, setProjetos] = useState<Projeto[]>(initialProjetos);
  const [view, setView] = useState<ViewMode>("kanban");
  const [loading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Projeto | null>(null);
  const [detailTarget, setDetailTarget] = useState<Projeto | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openDetail(projeto: Projeto) {
    setDetailTarget(projeto);
    setSheetOpen(true);
  }

  function handleSaved(projeto: Projeto, isNew: boolean) {
    setProjetos((prev) => (isNew ? [projeto, ...prev] : prev.map((p) => (p.id === projeto.id ? projeto : p))));
  }

  function handleUpdated(projeto: Projeto) {
    setProjetos((prev) => prev.map((p) => (p.id === projeto.id ? projeto : p)));
    setDetailTarget(projeto);
  }

  function handleDeleted(id: string) {
    setProjetos((prev) => prev.filter((p) => p.id !== id));
  }

  function handleStatusChange(id: string, status: StatusProjeto) {
    setProjetos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function openEdit(projeto: Projeto) {
    setEditTarget(projeto);
    setFormOpen(true);
  }

  function openNew() {
    setEditTarget(null);
    setFormOpen(true);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projetos</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Sites, sistemas, tráfego pago, branding e mais.
          </p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus size={15} />
          Novo projeto
        </Button>
      </div>

      <div className="mt-5 inline-flex rounded-[10px] border border-white/[0.08] bg-white/[0.02] p-1">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setView(opt.mode)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              view === opt.mode ? "bg-royal text-white" : "text-slate hover:text-white"
            )}
          >
            <opt.icon size={14} />
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-5 flex gap-3.5 overflow-x-auto pb-3.5">
          {PROJETO_KANBAN_COLUMNS.map((col) => (
            <div key={col.status} className="w-[280px] min-w-[280px] flex-shrink-0 space-y-2.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {view === "kanban" && (
            <ProjetoKanbanView
              projetos={projetos}
              empresas={empresas}
              profiles={profiles}
              onProjetoClick={openDetail}
              onStatusChange={handleStatusChange}
            />
          )}
          {view === "lista" && (
            <ProjetoListaView
              projetos={projetos}
              empresas={empresas}
              profiles={profiles}
              onProjetoClick={openDetail}
            />
          )}
          {view === "calendario" && (
            <ProjetoCalendarioView projetos={projetos} empresas={empresas} onProjetoClick={openDetail} />
          )}
        </>
      )}

      <ProjetoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        empresas={empresas}
        profiles={profiles}
        projeto={editTarget}
        onSaved={handleSaved}
      />
      <ProjetoDetailSheet
        projeto={detailTarget}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        empresas={empresas}
        profiles={profiles}
        currentUser={currentUser}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
        onEdit={() => {
          if (detailTarget) {
            setSheetOpen(false);
            openEdit(detailTarget);
          }
        }}
      />
    </div>
  );
}
