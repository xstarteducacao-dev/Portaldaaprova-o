"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "./lead-card";
import { KANBAN_COLUMNS } from "./kanban-columns";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const column = lead ? KANBAN_COLUMNS.find((c) => c.status === lead.status) : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle>{lead.empresa_nome}</SheetTitle>
              <SheetDescription>Detalhes do lead</SheetDescription>
            </SheetHeader>
            <div className="mt-2">
              {column && (
                <Badge variant="neon" className="mb-5">
                  {column.title}
                </Badge>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Responsável" value={lead.responsavel} />
                <Field label="Telefone" value={lead.telefone} />
                <Field label="Email" value={lead.email} />
                <Field label="Segmento" value={lead.segmento} />
                <Field label="Cidade" value={lead.cidade} />
                <Field label="UF" value={lead.uf} />
                <Field label="Origem" value={lead.origem} />
                <Field
                  label="Criado em"
                  value={new Date(lead.created_at).toLocaleDateString("pt-BR")}
                />
              </div>
              <div className="mt-4">
                <Field label="Observações" value={lead.observacoes} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
