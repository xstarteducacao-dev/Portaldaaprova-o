"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Eye, Plus } from "lucide-react";
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
import { ConsultoriaStatusBadge } from "./status-badge";
import { NewConsultoriaDialog } from "./new-consultoria-dialog";
import { ConclusaoDialog } from "./conclusao-dialog";
import { ConsultoriaDetailSheet } from "./consultoria-detail-sheet";
import type { Database, StatusConsultoria } from "@/types/database.types";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];
type EmpresaOption = { id: string; nome: string };
type ConsultorOption = { id: string; nome: string };

export function ConsultoriasTable({
  initialConsultorias,
  empresas,
  consultores,
}: {
  initialConsultorias: Consultoria[];
  empresas: EmpresaOption[];
  consultores: ConsultorOption[];
}) {
  const [consultorias, setConsultorias] = useState<Consultoria[]>(initialConsultorias);
  const [status, setStatus] = useState<string>("todos");
  const [consultorId, setConsultorId] = useState<string>("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [conclusaoTarget, setConclusaoTarget] = useState<Consultoria | null>(null);
  const [detailTarget, setDetailTarget] = useState<Consultoria | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const consultorNome = useMemo(() => {
    const map = new Map(consultores.map((c) => [c.id, c.nome]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [consultores]);

  const filtered = useMemo(() => {
    return consultorias.filter((c) => {
      if (status !== "todos" && c.status !== status) return false;
      if (consultorId !== "todos" && c.consultor_id !== consultorId) return false;
      const dataHora = new Date(c.data_hora);
      if (dataInicio && dataHora < new Date(dataInicio)) return false;
      if (dataFim && dataHora > new Date(`${dataFim}T23:59:59`)) return false;
      return true;
    });
  }, [consultorias, status, consultorId, dataInicio, dataFim]);

  function handleCreated(c: Consultoria) {
    setConsultorias((prev) => [c, ...prev]);
  }

  function handleCompleted(updated: Consultoria) {
    setConsultorias((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function openDetail(c: Consultoria) {
    setDetailTarget(c);
    setSheetOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Consultorias</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Cadastre e acompanhe as consultorias realizadas.
          </p>
        </div>
        <Button size="sm" onClick={() => setNewDialogOpen(true)}>
          <Plus size={15} />
          Nova consultoria
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="agendada">Agendada</SelectItem>
            <SelectItem value="realizada">Realizada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={consultorId} onValueChange={setConsultorId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Consultor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os consultores</SelectItem>
            {consultores.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-[150px]"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <span className="text-[12.5px] text-slate-dim">até</span>
          <Input
            type="date"
            className="w-[150px]"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={consultorias.length === 0 ? "Nenhuma consultoria cadastrada" : "Nenhum resultado"}
          description={
            consultorias.length === 0
              ? "Agende a primeira consultoria para começar a acompanhar o histórico."
              : "Ajuste os filtros para ver outras consultorias."
          }
          actionLabel={consultorias.length === 0 ? "Nova consultoria" : undefined}
          onAction={consultorias.length === 0 ? () => setNewDialogOpen(true) : undefined}
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-5 py-3 font-medium">Consultor</th>
                <th className="px-5 py-3 font-medium">Data/hora</th>
                <th className="px-5 py-3 font-medium">Formato</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5 font-medium text-white">{c.empresa_nome}</td>
                  <td className="px-5 py-3.5 text-slate">{consultorNome(c.consultor_id)}</td>
                  <td className="px-5 py-3.5 text-slate">
                    {new Date(c.data_hora).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-3.5 capitalize text-slate">{c.formato}</td>
                  <td className="px-5 py-3.5">
                    <ConsultoriaStatusBadge status={c.status as StatusConsultoria} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === "agendada" && (
                        <Button variant="outline" size="sm" onClick={() => setConclusaoTarget(c)}>
                          <CheckCircle2 size={14} />
                          Marcar como realizada
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openDetail(c)}>
                        <Eye size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewConsultoriaDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        empresas={empresas}
        consultores={consultores}
        onCreated={handleCreated}
      />
      <ConclusaoDialog
        open={Boolean(conclusaoTarget)}
        onOpenChange={(open) => !open && setConclusaoTarget(null)}
        consultoria={conclusaoTarget}
        onCompleted={handleCompleted}
      />
      <ConsultoriaDetailSheet consultoria={detailTarget} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
