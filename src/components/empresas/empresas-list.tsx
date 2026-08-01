"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EmpresaFormDialog } from "./empresa-form-dialog";
import type { Database } from "@/types/database.types";

type Empresa = Database["public"]["Tables"]["empresas"]["Row"];

export function EmpresasList({ initialEmpresas }: { initialEmpresas: Empresa[] }) {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>(initialEmpresas);
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);

  const segmentos = useMemo(() => {
    const set = new Set(empresas.map((e) => e.segmento).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [empresas]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return empresas.filter((e) => {
      const matchesTerm =
        !term ||
        e.nome.toLowerCase().includes(term) ||
        (e.cnpj ?? "").toLowerCase().includes(term);
      const matchesSegmento = segmento === "todos" || e.segmento === segmento;
      return matchesTerm && matchesSegmento;
    });
  }, [empresas, search, segmento]);

  function handleCreated(empresa: Empresa) {
    setEmpresas((prev) => [empresa, ...prev]);
  }

  async function handleDelete() {
    if (!empresaToDelete) return;
    const supabase = createClient();
    const { error } = await supabase.from("empresas").delete().eq("id", empresaToDelete.id);
    if (error) {
      toast.error("Não foi possível excluir a empresa", { description: error.message });
      return;
    }
    setEmpresas((prev) => prev.filter((e) => e.id !== empresaToDelete.id));
    toast.success("Empresa excluída");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Empresas</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Cadastro completo dos seus clientes e prospects.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus size={15} />
          Nova empresa
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dim" />
          <Input
            placeholder="Buscar por nome ou CNPJ"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={segmento} onValueChange={setSegmento}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os segmentos</SelectItem>
            {segmentos.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={empresas.length === 0 ? "Nenhuma empresa cadastrada" : "Nenhum resultado"}
          description={
            empresas.length === 0
              ? "Cadastre a primeira empresa para começar a organizar clientes e prospects."
              : "Ajuste a busca ou o filtro de segmento."
          }
          actionLabel={empresas.length === 0 ? "Nova empresa" : undefined}
          onAction={empresas.length === 0 ? () => setDialogOpen(true) : undefined}
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">CNPJ</th>
                <th className="px-5 py-3 font-medium">Segmento</th>
                <th className="px-5 py-3 font-medium">Funcionários</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((empresa) => (
                <tr
                  key={empresa.id}
                  className="cursor-pointer border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  onClick={() => router.push(`/empresas/${empresa.id}`)}
                >
                  <td className="px-5 py-3.5 font-medium text-white">{empresa.nome}</td>
                  <td className="px-5 py-3.5 text-slate">{empresa.cnpj || "—"}</td>
                  <td className="px-5 py-3.5 text-slate">{empresa.segmento || "—"}</td>
                  <td className="px-5 py-3.5 text-slate">{empresa.funcionarios || "—"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmpresaToDelete(empresa);
                      }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EmpresaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSaved={handleCreated} />
      <ConfirmDialog
        open={Boolean(empresaToDelete)}
        onOpenChange={(open) => !open && setEmpresaToDelete(null)}
        title="Excluir empresa"
        description={`Tem certeza que deseja excluir "${empresaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
}
