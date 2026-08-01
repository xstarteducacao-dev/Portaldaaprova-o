"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toCsv, downloadCsv } from "@/lib/csv";
import { TIPO_RELATORIO_LABELS, type TipoRelatorio } from "./relatorios-schema";
import { LeadsConversaoReport, type LeadsConversaoData } from "./leads-conversao-report";
import { ConsultoriasReport } from "./consultorias-report";
import { ProjetosStatusReport } from "./projetos-status-report";
import { FinanceiroReport, type FinanceiroReportData } from "./financeiro-report";
import type { Database } from "@/types/database.types";
import type { DonutSlice } from "@/lib/dashboard-data";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];

function defaultInicio() {
  const d = new Date();
  d.setMonth(d.getMonth() - 5);
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function defaultFim() {
  return new Date().toISOString().slice(0, 10);
}

export function RelatoriosView() {
  const [tipo, setTipo] = useState<TipoRelatorio>("leads_conversao");
  const [inicio, setInicio] = useState(defaultInicio());
  const [fim, setFim] = useState(defaultFim());

  const [leadsData, setLeadsData] = useState<LeadsConversaoData | null>(null);
  const [consultoriasData, setConsultoriasData] = useState<Consultoria[]>([]);
  const [projetosData, setProjetosData] = useState<DonutSlice[]>([]);
  const [financeiroData, setFinanceiroData] = useState<FinanceiroReportData | null>(null);

  const handleLeadsData = useCallback((data: LeadsConversaoData) => setLeadsData(data), []);
  const handleConsultoriasData = useCallback((rows: Consultoria[]) => setConsultoriasData(rows), []);
  const handleProjetosData = useCallback((data: DonutSlice[]) => setProjetosData(data), []);
  const handleFinanceiroData = useCallback((data: FinanceiroReportData) => setFinanceiroData(data), []);

  // Exportação em PDF/Excel (ex.: via jspdf/exceljs) fica planejada para uma slice futura;
  // por ora oferecemos apenas CSV, que já cobre a necessidade de exportação de dados tabulares.
  function exportarCsv() {
    let csv = "";
    let filename = "relatorio.csv";

    if (tipo === "leads_conversao" && leadsData) {
      csv = toCsv(
        ["Status", "Total"],
        leadsData.porStatus.map((p) => [p.label, p.total])
      );
      filename = "leads-conversao.csv";
    } else if (tipo === "consultorias_realizadas") {
      csv = toCsv(
        ["Empresa", "Data", "Diagnóstico"],
        consultoriasData.map((c) => [
          c.empresa_nome,
          new Date(c.data_hora).toLocaleDateString("pt-BR"),
          c.diagnostico ? "Sim" : "Não",
        ])
      );
      filename = "consultorias-realizadas.csv";
    } else if (tipo === "projetos_status") {
      csv = toCsv(
        ["Status", "Total"],
        projetosData.map((p) => [p.label, p.value])
      );
      filename = "projetos-por-status.csv";
    } else if (tipo === "financeiro" && financeiroData) {
      csv = toCsv(
        ["Mês", "Entradas", "Saídas", "Saldo acumulado"],
        financeiroData.pontos.map((p) => [p.label, p.entradas, p.saidas, p.saldo])
      );
      filename = "financeiro-receitas-despesas.csv";
    }

    if (!csv) return;
    downloadCsv(filename, csv);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Relatórios</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Exporte dados de receitas, clientes, consultorias, projetos e marketing.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={exportarCsv}>
          <Download size={15} />
          Exportar CSV
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3.5 rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px] sm:grid-cols-3">
        <div>
          <Label htmlFor="tipo">Tipo de relatório</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoRelatorio)}>
            <SelectTrigger className="mt-1.5" id="tipo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIPO_RELATORIO_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="inicio">Período — início</Label>
          <Input
            id="inicio"
            type="date"
            className="mt-1.5"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fim">Período — fim</Label>
          <Input
            id="fim"
            type="date"
            className="mt-1.5"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
        <div className="mb-3.5 text-[14.5px] font-semibold text-white">
          {TIPO_RELATORIO_LABELS[tipo]}
        </div>
        {tipo === "leads_conversao" && (
          <LeadsConversaoReport inicio={inicio} fim={fim} onData={handleLeadsData} />
        )}
        {tipo === "consultorias_realizadas" && (
          <ConsultoriasReport inicio={inicio} fim={fim} onData={handleConsultoriasData} />
        )}
        {tipo === "projetos_status" && (
          <ProjetosStatusReport inicio={inicio} fim={fim} onData={handleProjetosData} />
        )}
        {tipo === "financeiro" && (
          <FinanceiroReport inicio={inicio} fim={fim} onData={handleFinanceiroData} />
        )}
      </div>
    </div>
  );
}
