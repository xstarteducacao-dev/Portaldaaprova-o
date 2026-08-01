"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import { ContaReceberFormDialog } from "./conta-receber-form-dialog";
import { MarcarPagaDialog } from "./marcar-paga-dialog";
import { STATUS_CONTA_LABELS, StatusContaBadge, effectiveStatus, FORMA_PAGAMENTO_LABELS } from "./financeiro-labels";
import type { Database } from "@/types/database.types";

type ContaReceber = Database["public"]["Tables"]["contas_receber"]["Row"];
type EmpresaOption = { id: string; nome: string };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

export function ContasReceberTable({
  initialContas,
  empresas,
}: {
  initialContas: ContaReceber[];
  empresas: EmpresaOption[];
}) {
  const [contas, setContas] = useState<ContaReceber[]>(initialContas);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ContaReceber | null>(null);
  const [pagaTarget, setPagaTarget] = useState<ContaReceber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContaReceber | null>(null);

  const empresaNome = useMemo(() => {
    const map = new Map(empresas.map((e) => [e.id, e.nome]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [empresas]);

  const filtered = useMemo(() => {
    if (statusFilter === "todos") return contas;
    return contas.filter((c) => effectiveStatus(c.status, c.vencimento) === statusFilter);
  }, [contas, statusFilter]);

  function handleSaved(conta: ContaReceber) {
    setContas((prev) => {
      const exists = prev.some((c) => c.id === conta.id);
      return exists ? prev.map((c) => (c.id === conta.id ? conta : c)) : [conta, ...prev];
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const supabase = createClient();
    const { error } = await supabase.from("contas_receber").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Não foi possível excluir a conta", { description: error.message });
      return;
    }
    setContas((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success("Conta excluída");
  }

  async function refreshPaga() {
    if (!pagaTarget) return;
    const supabase = createClient();
    const { data } = await supabase.from("contas_receber").select("*").eq("id", pagaTarget.id).single();
    if (data) handleSaved(data as ContaReceber);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(STATUS_CONTA_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={() => {
            setEditTarget(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={15} />
          Nova conta
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CircleDollarSign}
          title={contas.length === 0 ? "Nenhuma conta a receber" : "Nenhum resultado"}
          description={
            contas.length === 0
              ? "Cadastre a primeira conta a receber para começar."
              : "Ajuste os filtros para ver outras contas."
          }
          actionLabel={contas.length === 0 ? "Nova conta" : undefined}
          onAction={
            contas.length === 0
              ? () => {
                  setEditTarget(null);
                  setDialogOpen(true);
                }
              : undefined
          }
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Vencimento</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Pagamento</th>
                <th className="px-5 py-3 font-medium">Parcelas</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((conta) => {
                const status = effectiveStatus(conta.status, conta.vencimento);
                return (
                  <tr
                    key={conta.id}
                    className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3.5 font-medium text-white">{empresaNome(conta.cliente_id)}</td>
                    <td className="px-5 py-3.5 text-slate">{conta.descricao}</td>
                    <td className="px-5 py-3.5 text-white">{currency.format(conta.valor)}</td>
                    <td className="px-5 py-3.5 text-slate">{formatDate(conta.vencimento)}</td>
                    <td className="px-5 py-3.5">
                      <StatusContaBadge status={status} />
                    </td>
                    <td className="px-5 py-3.5 text-slate">
                      {conta.forma_pagamento ? FORMA_PAGAMENTO_LABELS[conta.forma_pagamento] : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate">
                      {conta.parcela_atual}/{conta.parcelas}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {conta.status !== "pago" && (
                          <Button variant="outline" size="sm" onClick={() => setPagaTarget(conta)}>
                            Marcar como paga
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditTarget(conta);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(conta)}>
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ContaReceberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        conta={editTarget}
        empresas={empresas}
        onSaved={handleSaved}
      />
      <MarcarPagaDialog
        open={Boolean(pagaTarget)}
        onOpenChange={(open) => !open && setPagaTarget(null)}
        tabela="contas_receber"
        contaId={pagaTarget?.id ?? null}
        onSaved={refreshPaga}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir conta"
        description={`Tem certeza que deseja excluir "${deleteTarget?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
}
