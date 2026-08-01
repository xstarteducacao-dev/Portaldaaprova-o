"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import { StatusCampanhaBadge, TipoCampanhaBadge } from "./campanha-labels";
import { resultadosSchema, type ResultadosFormValues } from "./campanha-schema";
import type { Database } from "@/types/database.types";

type Campanha = Database["public"]["Tables"]["campanhas"]["Row"];
type EmpresaOption = { id: string; nome: string };

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

function resultadosToFormValues(campanha: Campanha): ResultadosFormValues {
  const r = campanha.resultados ?? {};
  return {
    impressoes: r.impressoes !== undefined ? String(r.impressoes) : "",
    cliques: r.cliques !== undefined ? String(r.cliques) : "",
    conversoes: r.conversoes !== undefined ? String(r.conversoes) : "",
    leads_gerados: r.leads_gerados !== undefined ? String(r.leads_gerados) : "",
    observacoes: r.observacoes ?? "",
  };
}

export function CampanhaDetailSheet({
  campanha,
  open,
  onOpenChange,
  empresas,
  onUpdated,
  onDeleted,
  onEdit,
}: {
  campanha: Campanha | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: EmpresaOption[];
  onUpdated: (campanha: Campanha) => void;
  onDeleted: (id: string) => void;
  onEdit: () => void;
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ResultadosFormValues>({ resolver: zodResolver(resultadosSchema) });

  useEffect(() => {
    if (campanha) reset(resultadosToFormValues(campanha));
  }, [campanha, reset]);

  if (!campanha) {
    return <Sheet open={open} onOpenChange={onOpenChange} />;
  }

  const clienteNome = empresas.find((e) => e.id === campanha.cliente_id)?.nome;
  const resultados = campanha.resultados ?? {};
  const ctr =
    resultados.impressoes && resultados.impressoes > 0 && typeof resultados.cliques === "number"
      ? ((resultados.cliques / resultados.impressoes) * 100).toFixed(2)
      : null;
  const taxaConversao =
    resultados.cliques && resultados.cliques > 0 && typeof resultados.conversoes === "number"
      ? ((resultados.conversoes / resultados.cliques) * 100).toFixed(2)
      : null;

  async function onSubmit(values: ResultadosFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      resultados: {
        impressoes: values.impressoes ? Number(values.impressoes) : undefined,
        cliques: values.cliques ? Number(values.cliques) : undefined,
        conversoes: values.conversoes ? Number(values.conversoes) : undefined,
        leads_gerados: values.leads_gerados ? Number(values.leads_gerados) : undefined,
        observacoes: values.observacoes || undefined,
      },
    };
    const { data, error } = await supabase
      .from("campanhas")
      .update(payload)
      .eq("id", campanha!.id)
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível salvar os resultados", { description: error?.message });
      return;
    }
    toast.success("Resultados atualizados");
    onUpdated(data as Campanha);
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("campanhas").delete().eq("id", campanha!.id);
    if (error) {
      toast.error("Não foi possível excluir a campanha", { description: error.message });
      return;
    }
    toast.success("Campanha excluída");
    onDeleted(campanha!.id);
    onOpenChange(false);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{campanha.nome}</SheetTitle>
            <SheetDescription>{clienteNome ?? "Sem cliente vinculado"}</SheetDescription>
          </SheetHeader>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TipoCampanhaBadge tipo={campanha.tipo} />
            <StatusCampanhaBadge status={campanha.status} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              Editar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setConfirmDeleteOpen(true)}>
              <Trash2 size={13} />
              Excluir
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field
              label="Investimento"
              value={campanha.investimento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            />
            <Field
              label="Período"
              value={`${new Date(`${campanha.data_inicio}T00:00:00`).toLocaleDateString("pt-BR")}${
                campanha.data_fim
                  ? ` – ${new Date(`${campanha.data_fim}T00:00:00`).toLocaleDateString("pt-BR")}`
                  : ""
              }`}
            />
          </div>

          {campanha.objetivo && (
            <div className="mt-5">
              <Field label="Objetivo" value={campanha.objetivo} />
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-3 text-[13px] font-semibold text-white">Resultados</h3>
            {(ctr || taxaConversao) && (
              <div className="mb-3 flex gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                {ctr && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-dim">CTR</div>
                    <div className="text-[14px] font-semibold text-accent">{ctr}%</div>
                  </div>
                )}
                {taxaConversao && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-dim">Conversão</div>
                    <div className="text-[14px] font-semibold text-accent">{taxaConversao}%</div>
                  </div>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="impressoes">Impressões</Label>
                <Input id="impressoes" type="number" min="0" className="mt-1.5" {...register("impressoes")} />
              </div>
              <div>
                <Label htmlFor="cliques">Cliques</Label>
                <Input id="cliques" type="number" min="0" className="mt-1.5" {...register("cliques")} />
              </div>
              <div>
                <Label htmlFor="conversoes">Conversões</Label>
                <Input id="conversoes" type="number" min="0" className="mt-1.5" {...register("conversoes")} />
              </div>
              <div>
                <Label htmlFor="leads_gerados">Leads gerados</Label>
                <Input
                  id="leads_gerados"
                  type="number"
                  min="0"
                  className="mt-1.5"
                  {...register("leads_gerados")}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" className="mt-1.5" {...register("observacoes")} />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar resultados"}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Excluir campanha"
        description={`Tem certeza que deseja excluir "${campanha.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </>
  );
}
