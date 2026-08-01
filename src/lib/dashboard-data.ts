import { createClient } from "@/lib/supabase/server";

export interface StatData {
  receitaMes: number;
  projetosAtivos: number;
  consultoriasRealizadas: number;
  consultoriasAgendadas: number;
  clientesAtivos: number;
  novosLeads: number;
  taxaConversao: number;
  tarefasPendentes: number;
}

export interface MonthPoint {
  label: string;
  value: number;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface AgendaItem {
  hora: string;
  titulo: string;
  tipo: string;
}

export interface AtividadeItem {
  texto: string;
  tempo: string;
}

export interface DashboardData {
  stats: StatData;
  faturamento: MonthPoint[];
  consultoriasPorMes: MonthPoint[];
  statusProjetos: DonutSlice[];
  agenda: AgendaItem[];
  atividades: AtividadeItem[];
}

// Most of the tables this dashboard queries (contas_receber, projetos, consultorias) don't
// exist yet in this delivery slice — only `profiles` and `leads` are guaranteed. Every
// aggregate below is wrapped so a missing table/relation degrades gracefully to an empty
// result instead of crashing the page; the real numbers appear automatically once each
// table is created in a later slice.
async function safeCount(
  query: Promise<{ count: number | null; error: unknown }>
): Promise<number> {
  try {
    const { count, error } = await query;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function safeSum(
  query: Promise<{ data: { valor: number | null }[] | null; error: unknown }>
): Promise<number> {
  try {
    const { data, error } = await query;
    if (error || !data) return 0;
    return data.reduce((acc, row) => acc + (row.valor ?? 0), 0);
  } catch {
    return 0;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    receitaMes,
    projetosAtivos,
    consultoriasRealizadas,
    consultoriasAgendadas,
    clientesAtivos,
    novosLeads,
    totalLeads,
    tarefasPendentes,
  ] = await Promise.all([
    safeSum(
      supabase
        .from("contas_receber")
        .select("valor")
        .gte("created_at", startOfMonth) as unknown as Promise<{
        data: { valor: number | null }[] | null;
        error: unknown;
      }>
    ),
    safeCount(
      supabase
        .from("projetos")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativo") as unknown as Promise<{ count: number | null; error: unknown }>
    ),
    safeCount(
      supabase
        .from("consultorias")
        .select("*", { count: "exact", head: true })
        .eq("status", "realizada")
        .gte("created_at", startOfMonth) as unknown as Promise<{
        count: number | null;
        error: unknown;
      }>
    ),
    safeCount(
      supabase
        .from("consultorias")
        .select("*", { count: "exact", head: true })
        .eq("status", "agendada") as unknown as Promise<{ count: number | null; error: unknown }>
    ),
    safeCount(
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "cliente") as unknown as Promise<{ count: number | null; error: unknown }>
    ),
    safeCount(
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth) as unknown as Promise<{
        count: number | null;
        error: unknown;
      }>
    ),
    safeCount(
      supabase.from("leads").select("*", { count: "exact", head: true }) as unknown as Promise<{
        count: number | null;
        error: unknown;
      }>
    ),
    safeCount(
      supabase
        .from("tarefas")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente") as unknown as Promise<{ count: number | null; error: unknown }>
    ),
  ]);

  const taxaConversao = totalLeads > 0 ? Math.round((clientesAtivos / totalLeads) * 1000) / 10 : 0;

  const stats: StatData = {
    receitaMes,
    projetosAtivos,
    consultoriasRealizadas,
    consultoriasAgendadas,
    clientesAtivos,
    novosLeads,
    taxaConversao,
    tarefasPendentes,
  };

  const faturamento = await getMonthSeries(supabase, "contas_receber");
  const consultoriasPorMes = await getMonthSeries(supabase, "consultorias");
  const statusProjetos = await getProjectStatusBreakdown(supabase);

  return {
    stats,
    faturamento,
    consultoriasPorMes,
    statusProjetos,
    agenda: [],
    atividades: [],
  };
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

async function getMonthSeries(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string
): Promise<MonthPoint[]> {
  const now = new Date();
  const months: MonthPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: MESES[d.getMonth()], value: 0 });
  }
  try {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();
    const { data, error } = await supabase
      .from(table)
      .select("created_at")
      .gte("created_at", start);
    if (error || !data) return months;
    for (const row of data as { created_at: string }[]) {
      const d = new Date(row.created_at);
      const idx = months.findIndex((_, i) => {
        const target = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return target.getMonth() === d.getMonth() && target.getFullYear() === d.getFullYear();
      });
      if (idx >= 0) months[idx].value += 1;
    }
    return months;
  } catch {
    return months;
  }
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  planejamento: "#5c6486",
  em_andamento: "#2b52ff",
  concluido: "#4ade80",
  pausado: "#fbbf24",
};

async function getProjectStatusBreakdown(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<DonutSlice[]> {
  try {
    const { data, error } = await supabase.from("projetos").select("status");
    if (error || !data) return [];
    const counts = new Map<string, number>();
    for (const row of data as { status: string }[]) {
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, value]) => ({
      label,
      value,
      color: PROJECT_STATUS_COLORS[label] ?? "#93a0c2",
    }));
  } catch {
    return [];
  }
}
