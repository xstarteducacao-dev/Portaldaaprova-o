"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ExternalLink, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import {
  PrioridadeChamadoBadge,
  STATUS_CHAMADO_LABELS,
  StatusChamadoBadge,
  StatusSistemaBadge,
} from "./sistema-labels";
import { chamadoSchema, type ChamadoFormValues } from "./sistema-schema";
import type { Database, StatusChamado } from "@/types/database.types";

type Sistema = Database["public"]["Tables"]["sistemas"]["Row"];
type Chamado = Database["public"]["Tables"]["chamados"]["Row"];
type EmpresaOption = { id: string; nome: string };
type ProfileOption = { id: string; nome: string };

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

export function SistemaDetailSheet({
  sistema,
  chamados,
  open,
  onOpenChange,
  empresas,
  profiles,
  currentUser,
  onDeleted,
  onEdit,
  onChamadosChanged,
}: {
  sistema: Sistema | null;
  chamados: Chamado[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  currentUser: { id: string; nome: string };
  onDeleted: (id: string) => void;
  onEdit: () => void;
  onChamadosChanged: (chamados: Chamado[]) => void;
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ChamadoFormValues>({
    resolver: zodResolver(chamadoSchema),
    defaultValues: { prioridade: "media" },
  });

  if (!sistema) {
    return <Sheet open={open} onOpenChange={onOpenChange} />;
  }

  const empresaNome = empresas.find((e) => e.id === sistema.cliente_id)?.nome;
  const profileNome = (id: string | null) =>
    id ? profiles.find((p) => p.id === id)?.nome ?? "—" : "—";

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("sistemas").delete().eq("id", sistema!.id);
    if (error) {
      toast.error("Não foi possível excluir o sistema", { description: error.message });
      return;
    }
    toast.success("Sistema excluído");
    onDeleted(sistema!.id);
    onOpenChange(false);
  }

  async function handleNovoChamado(values: ChamadoFormValues) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chamados")
      .insert({
        sistema_id: sistema!.id,
        titulo: values.titulo,
        descricao: values.descricao || null,
        prioridade: values.prioridade,
        status: "aberto",
        aberto_por: currentUser.id || null,
      })
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível abrir o chamado", { description: error?.message });
      return;
    }

    toast.success("Chamado aberto com sucesso");
    onChamadosChanged([data as Chamado, ...chamados]);
    reset({ titulo: "", descricao: "", prioridade: "media" });
  }

  async function handleStatusChange(chamado: Chamado, status: StatusChamado) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chamados")
      .update({ status })
      .eq("id", chamado.id)
      .select()
      .single();
    if (error || !data) {
      toast.error("Não foi possível atualizar o chamado", { description: error?.message });
      return;
    }
    onChamadosChanged(chamados.map((c) => (c.id === chamado.id ? (data as Chamado) : c)));
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{sistema.sistema}</SheetTitle>
            <SheetDescription>{empresaNome ?? "Sem cliente vinculado"}</SheetDescription>
          </SheetHeader>

          <div className="mt-2">
            <StatusSistemaBadge status={sistema.status} />
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
            <Field label="Versão" value={sistema.versao} />
            {sistema.documentacao_url ? (
              <div>
                <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">Documentação</div>
                <a
                  href={sistema.documentacao_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-accent hover:underline"
                >
                  Acessar
                  <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <Field label="Documentação" value={null} />
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-[13px] font-semibold text-white">Chamados</h3>
            <div className="space-y-2.5">
              {chamados.map((chamado) => (
                <div key={chamado.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium text-white">{chamado.titulo}</span>
                    <PrioridadeChamadoBadge prioridade={chamado.prioridade} />
                  </div>
                  {chamado.descricao && (
                    <p className="mb-2 whitespace-pre-wrap text-[12px] text-slate">{chamado.descricao}</p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] text-slate-dim">
                      {profileNome(chamado.aberto_por)} ·{" "}
                      {formatDistanceToNow(new Date(chamado.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                    <Select
                      value={chamado.status}
                      onValueChange={(v) => handleStatusChange(chamado, v as StatusChamado)}
                    >
                      <SelectTrigger className="h-7 w-[150px] text-[11.5px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CHAMADO_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-1.5">
                    <StatusChamadoBadge status={chamado.status} />
                  </div>
                </div>
              ))}
              {chamados.length === 0 && (
                <p className="text-[12px] text-slate-dim">Nenhum chamado registrado.</p>
              )}
            </div>

            <form onSubmit={handleSubmit(handleNovoChamado)} className="mt-4 flex flex-col gap-2.5">
              <div>
                <Label htmlFor="titulo">Novo chamado</Label>
                <Input id="titulo" placeholder="Título" className="mt-1.5" {...register("titulo")} />
                {errors.titulo && <p className="mt-1 text-xs text-red-400">{errors.titulo.message}</p>}
              </div>
              <Textarea placeholder="Descrição" {...register("descricao")} />
              <Controller
                control={control}
                name="prioridade"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Button type="submit" size="sm" variant="outline" className="self-end" disabled={loading}>
                {loading ? "Abrindo..." : "Abrir chamado"}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Excluir sistema"
        description={`Tem certeza que deseja excluir "${sistema.sistema}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </>
  );
}
