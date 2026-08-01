"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderKanban, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultoriaStatusBadge } from "@/components/consultorias/status-badge";
import { createClient } from "@/lib/supabase/client";
import { EmpresaFormDialog } from "./empresa-form-dialog";
import type { Database } from "@/types/database.types";

type Empresa = Database["public"]["Tables"]["empresas"]["Row"];
type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] uppercase tracking-wide text-slate-dim">{label}</div>
      <div className="text-[13.5px] text-white">{value || "—"}</div>
    </div>
  );
}

export function EmpresaDetail({
  empresa: initialEmpresa,
  consultorias,
}: {
  empresa: Empresa;
  consultorias: Consultoria[];
}) {
  const router = useRouter();
  const [empresa, setEmpresa] = useState(initialEmpresa);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const contato = empresa.contatos?.[0];
  const redes = empresa.redes_sociais ?? {};
  const endereco = empresa.endereco ?? {};

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("empresas").delete().eq("id", empresa.id);
    if (error) {
      toast.error("Não foi possível excluir a empresa", { description: error.message });
      return;
    }
    toast.success("Empresa excluída");
    router.push("/empresas");
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.push("/empresas")} className="mb-3">
        <ArrowLeft size={15} />
        Voltar
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{empresa.nome}</h1>
          <p className="mt-1 text-[13.5px] text-slate">{empresa.razao_social || "Razão social não informada"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil size={14} />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={14} />
            Excluir
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
          <div className="mb-4 text-[14.5px] font-semibold text-white">Dados gerais</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CNPJ" value={empresa.cnpj} />
            <Field label="Segmento" value={empresa.segmento} />
            <Field label="Funcionários" value={empresa.funcionarios} />
            <Field
              label="Criada em"
              value={new Date(empresa.created_at).toLocaleDateString("pt-BR")}
            />
          </div>
          <div className="mt-4">
            <Field label="Observações" value={empresa.observacoes} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
          <div className="mb-4 text-[14.5px] font-semibold text-white">Contato principal</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome" value={contato?.nome} />
            <Field label="Cargo" value={contato?.cargo} />
            <Field label="Telefone" value={contato?.telefone} />
            <Field label="Email" value={contato?.email} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
          <div className="mb-4 text-[14.5px] font-semibold text-white">Redes sociais</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram" value={redes.instagram} />
            <Field label="Facebook" value={redes.facebook} />
            <Field label="LinkedIn" value={redes.linkedin} />
            <Field label="Site" value={redes.site} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
          <div className="mb-4 text-[14.5px] font-semibold text-white">Endereço</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CEP" value={endereco.cep} />
            <Field
              label="Logradouro"
              value={[endereco.logradouro, endereco.numero].filter(Boolean).join(", ")}
            />
            <Field label="Bairro" value={endereco.bairro} />
            <Field label="Cidade/UF" value={[endereco.cidade, endereco.uf].filter(Boolean).join(" / ")} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-card p-5">
        <div className="mb-4 text-[14.5px] font-semibold text-white">Consultorias vinculadas</div>
        {consultorias.length === 0 ? (
          <p className="text-[13px] text-slate">Nenhuma consultoria vinculada a esta empresa ainda.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {consultorias.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
              >
                <div>
                  <div className="text-[13px] text-white">
                    {new Date(c.data_hora).toLocaleString("pt-BR")}
                  </div>
                  <div className="text-[11.5px] capitalize text-slate-dim">{c.formato}</div>
                </div>
                <ConsultoriaStatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-card p-5">
        <EmptyState
          icon={FolderKanban}
          title="Projetos vinculados"
          description="O módulo de projetos ainda não está disponível. Em breve você verá aqui os projetos desta empresa."
        />
      </div>

      <EmpresaFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        empresa={empresa}
        onSaved={setEmpresa}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir empresa"
        description={`Tem certeza que deseja excluir "${empresa.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
}
