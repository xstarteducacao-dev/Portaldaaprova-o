"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PrioridadeBadge, STATUS_LABELS, TipoBadge } from "./projeto-labels";
import { ProgressBar } from "./progress-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { EmpresaOption, ProfileOption, Projeto } from "./types";
import type { ProjetoChecklistItem, ProjetoComentario, StatusProjeto } from "@/types/database.types";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

export function ProjetoDetailSheet({
  projeto,
  open,
  onOpenChange,
  empresas,
  profiles,
  currentUser,
  onUpdated,
  onDeleted,
  onEdit,
}: {
  projeto: Projeto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  currentUser: { id: string; nome: string };
  onUpdated: (projeto: Projeto) => void;
  onDeleted: (id: string) => void;
  onEdit: () => void;
}) {
  const [novoItem, setNovoItem] = useState("");
  const [novoComentario, setNovoComentario] = useState("");
  const [progresso, setProgresso] = useState(projeto?.progresso ?? 0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // Re-sync the local slider value whenever a different (or freshly updated) project loads,
  // without the setState-in-effect cascade lint flags — tracked via the previous id/progresso seen.
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const currentKey = projeto ? `${projeto.id}:${projeto.progresso}` : null;
  if (projeto && currentKey !== syncedKey && progresso !== projeto.progresso) {
    setProgresso(projeto.progresso);
  }
  if (currentKey !== syncedKey) {
    setSyncedKey(currentKey);
  }

  if (!projeto) {
    return <Sheet open={open} onOpenChange={onOpenChange} />;
  }

  const empresaNome = projeto.cliente_id ? empresas.find((e) => e.id === projeto.cliente_id)?.nome : undefined;
  const responsavelNome = projeto.responsavel_id
    ? profiles.find((p) => p.id === projeto.responsavel_id)?.nome
    : undefined;
  const equipeNomes = projeto.equipe
    .map((id) => profiles.find((p) => p.id === id)?.nome)
    .filter(Boolean) as string[];

  async function persist(patch: Partial<Projeto>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projetos")
      .update(patch)
      .eq("id", projeto!.id)
      .select()
      .single();
    if (error || !data) {
      toast.error("Não foi possível salvar as alterações", { description: error?.message });
      return null;
    }
    onUpdated(data as Projeto);
    return data as Projeto;
  }

  async function handleStatusChange(status: StatusProjeto) {
    await persist({ status });
  }

  async function handleProgressoBlur() {
    if (progresso === projeto!.progresso) return;
    setSaving(true);
    await persist({ progresso });
    setSaving(false);
  }

  async function handleAddChecklistItem() {
    if (!novoItem.trim()) return;
    const item: ProjetoChecklistItem = { id: crypto.randomUUID(), texto: novoItem.trim(), concluido: false };
    const checklist = [...projeto!.checklist, item];
    setNovoItem("");
    await persist({ checklist });
  }

  async function handleToggleChecklistItem(id: string) {
    const checklist = projeto!.checklist.map((i) => (i.id === id ? { ...i, concluido: !i.concluido } : i));
    await persist({ checklist });
  }

  async function handleRemoveChecklistItem(id: string) {
    const checklist = projeto!.checklist.filter((i) => i.id !== id);
    await persist({ checklist });
  }

  async function handleAddComentario() {
    if (!novoComentario.trim()) return;
    const comentario: ProjetoComentario = {
      id: crypto.randomUUID(),
      autor_id: currentUser.id,
      autor_nome: currentUser.nome,
      texto: novoComentario.trim(),
      criado_em: new Date().toISOString(),
    };
    const comentarios = [...projeto!.comentarios, comentario];
    setNovoComentario("");
    await persist({ comentarios });
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("projetos").delete().eq("id", projeto!.id);
    if (error) {
      toast.error("Não foi possível excluir o projeto", { description: error.message });
      return;
    }
    toast.success("Projeto excluído com sucesso");
    onDeleted(projeto!.id);
    onOpenChange(false);
  }

  const checklistTotal = projeto.checklist.length;
  const checklistFeitos = projeto.checklist.filter((i) => i.concluido).length;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{projeto.nome}</SheetTitle>
            <SheetDescription>{empresaNome ?? "Sem cliente vinculado"}</SheetDescription>
          </SheetHeader>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TipoBadge tipo={projeto.tipo} />
            <PrioridadeBadge prioridade={projeto.prioridade} />
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
            <div>
              <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">Status</div>
              <Select value={projeto.status} onValueChange={(v) => handleStatusChange(v as StatusProjeto)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field
              label="Prazo"
              value={projeto.prazo ? new Date(`${projeto.prazo}T00:00:00`).toLocaleDateString("pt-BR") : null}
            />
            <Field label="Responsável" value={responsavelNome} />
            <Field label="Equipe" value={equipeNomes.length > 0 ? equipeNomes.join(", ") : null} />
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[11.5px] uppercase tracking-wide text-slate-dim">
              <span>Progresso</span>
              <span>{saving ? "Salvando..." : `${progresso}%`}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progresso}
                onChange={(e) => setProgresso(Number(e.target.value))}
                onMouseUp={handleProgressoBlur}
                onTouchEnd={handleProgressoBlur}
                className="h-1.5 flex-1 cursor-pointer accent-accent"
              />
              <span className="w-10 text-right text-[12.5px] text-white">{progresso}%</span>
            </div>
            <ProgressBar value={progresso} className="mt-2" />
          </div>

          {projeto.descricao && (
            <div className="mt-5">
              <Field label="Descrição" value={projeto.descricao} />
            </div>
          )}

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-white">Checklist</h3>
              <span className="text-[11px] text-slate-dim">
                {checklistFeitos}/{checklistTotal}
              </span>
            </div>
            <div className="space-y-1.5">
              {projeto.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
                >
                  <Checkbox
                    checked={item.concluido}
                    onCheckedChange={() => handleToggleChecklistItem(item.id)}
                  />
                  <span
                    className={`flex-1 text-[12.5px] ${item.concluido ? "text-slate-dim line-through" : "text-white"}`}
                  >
                    {item.texto}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-dim hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {projeto.checklist.length === 0 && (
                <p className="text-[12px] text-slate-dim">Nenhum item na checklist.</p>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Adicionar item..."
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddChecklistItem}>
                <Plus size={15} />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-[13px] font-semibold text-white">Comentários</h3>
            <div className="space-y-3">
              {projeto.comentarios.map((c) => (
                <div key={c.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12.5px] font-semibold text-white">{c.autor_nome}</span>
                    <span className="text-[10.5px] text-slate-dim">
                      {formatDistanceToNow(new Date(c.criado_em), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-[12.5px] text-slate">{c.texto}</p>
                </div>
              ))}
              {projeto.comentarios.length === 0 && (
                <p className="text-[12px] text-slate-dim">Nenhum comentário ainda.</p>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Textarea
                placeholder="Escreva um comentário..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
              />
              <Button type="button" size="sm" variant="outline" className="self-end" onClick={handleAddComentario}>
                Comentar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Excluir projeto"
        description={`Tem certeza que deseja excluir "${projeto.nome}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </>
  );
}
