"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ConsultoriaStatusBadge } from "./status-badge";
import type { Database } from "@/types/database.types";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="whitespace-pre-wrap text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

export function ConsultoriaDetailSheet({
  consultoria,
  open,
  onOpenChange,
}: {
  consultoria: Consultoria | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        {consultoria && (
          <>
            <SheetHeader>
              <SheetTitle>{consultoria.empresa_nome}</SheetTitle>
              <SheetDescription>
                {new Date(consultoria.data_hora).toLocaleString("pt-BR")}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2">
              <ConsultoriaStatusBadge status={consultoria.status} />
              <div className="mt-5 grid grid-cols-2 gap-4">
                <Field label="Formato" value={consultoria.formato} />
                <Field
                  label="Criada em"
                  value={new Date(consultoria.created_at).toLocaleDateString("pt-BR")}
                />
              </div>
              {consultoria.status === "realizada" && (
                <div className="mt-5 flex flex-col gap-4">
                  <Field label="Diagnóstico" value={consultoria.diagnostico} />
                  <Field label="Branding" value={consultoria.branding} />
                  <Field label="Posicionamento" value={consultoria.posicionamento} />
                  <Field label="Marketing" value={consultoria.marketing} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Pontos fortes" value={consultoria.pontos_fortes} />
                    <Field label="Pontos fracos" value={consultoria.pontos_fracos} />
                    <Field label="Oportunidades" value={consultoria.oportunidades} />
                    <Field label="Ameaças" value={consultoria.ameacas} />
                  </div>
                  <Field label="Plano estratégico" value={consultoria.plano_estrategico} />
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
