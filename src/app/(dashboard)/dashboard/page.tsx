import {
  Wallet,
  FolderKanban,
  CalendarCheck,
  CalendarClock,
  Users,
  UserPlus,
  Percent,
  ListChecks,
  BarChart3,
  PieChart,
  CalendarDays,
  Activity,
} from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  RevenueAreaChart,
  ConsultoriasBarChart,
  ProjetosDonutChart,
} from "@/components/dashboard/charts";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function DashboardPage() {
  const { stats, faturamento, consultoriasPorMes, statusProjetos, agenda, atividades } =
    await getDashboardData();

  const hasFaturamento = faturamento.some((p) => p.value > 0);
  const hasConsultorias = consultoriasPorMes.some((p) => p.value > 0);
  const hasStatusProjetos = statusProjetos.length > 0;

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Visão geral</h1>
        <p className="mt-1 text-[13.5px] text-slate">
          Bem-vindo de volta, aqui está o resumo do seu negócio.
        </p>
      </div>

      <div className="mt-[22px] grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Receita do mês" value={currency.format(stats.receitaMes)} />
        <StatCard icon={FolderKanban} label="Projetos ativos" value={String(stats.projetosAtivos)} />
        <StatCard
          icon={CalendarCheck}
          label="Consultorias realizadas (mês)"
          value={String(stats.consultoriasRealizadas)}
        />
        <StatCard
          icon={CalendarClock}
          label="Consultorias agendadas"
          value={String(stats.consultoriasAgendadas)}
        />
        <StatCard icon={Users} label="Clientes ativos" value={String(stats.clientesAtivos)} />
        <StatCard icon={UserPlus} label="Novos leads (mês)" value={String(stats.novosLeads)} />
        <StatCard icon={Percent} label="Taxa de conversão" value={`${stats.taxaConversao}%`} />
        <StatCard icon={ListChecks} label="Tarefas pendentes" value={String(stats.tarefasPendentes)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
          <div className="text-[14.5px] font-semibold text-white">Faturamento mensal</div>
          <div className="mb-3.5 mt-0.5 text-xs text-slate-dim">Últimos 6 meses</div>
          {hasFaturamento ? (
            <RevenueAreaChart data={faturamento} />
          ) : (
            <EmptyState
              icon={BarChart3}
              title="Sem dados de faturamento"
              description="Assim que houver contas a receber lançadas, o gráfico aparece aqui."
            />
          )}
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
          <div className="text-[14.5px] font-semibold text-white">Status dos projetos</div>
          <div className="mb-3.5 mt-0.5 text-xs text-slate-dim">Distribuição atual</div>
          {hasStatusProjetos ? (
            <div className="flex items-center gap-5">
              <ProjetosDonutChart data={statusProjetos} />
              <div className="flex flex-1 flex-col gap-2.5">
                {statusProjetos.map((slice) => (
                  <div key={slice.label} className="flex items-center gap-2 text-[12.5px] text-slate">
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-sm"
                      style={{ background: slice.color }}
                    />
                    <span className="capitalize">{slice.label.replace(/_/g, " ")}</span>
                    <b className="ml-auto font-semibold text-white">{slice.value}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={PieChart}
              title="Nenhum projeto cadastrado"
              description="A distribuição de status aparece assim que projetos forem criados."
            />
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
          <div className="text-[14.5px] font-semibold text-white">Consultorias por mês</div>
          {hasConsultorias ? (
            <ConsultoriasBarChart data={consultoriasPorMes} />
          ) : (
            <EmptyState
              icon={BarChart3}
              title="Sem consultorias registradas"
              description="Cadastre consultorias para ver a evolução mensal."
              className="mt-3.5 py-8"
            />
          )}
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
          <div className="text-[14.5px] font-semibold text-white">Agenda de hoje</div>
          {agenda.length > 0 ? (
            <div className="mt-3.5 flex flex-col gap-3">
              {agenda.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-10 flex-shrink-0 text-xs font-semibold text-accent">{item.hora}</span>
                  <div>
                    <div className="truncate text-[13px] text-white">{item.titulo}</div>
                    <div className="text-[11px] text-slate-dim">{item.tipo}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Nenhum compromisso hoje"
              description="Sua agenda do dia aparecerá aqui."
              className="mt-3.5 py-8"
            />
          )}
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
          <div className="text-[14.5px] font-semibold text-white">Últimas atividades</div>
          {atividades.length > 0 ? (
            <div className="mt-3.5 flex flex-col gap-3.5">
              {atividades.map((item, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="text-[12.5px] leading-snug text-[#c9d0e3]">{item.texto}</p>
                    <span className="text-[11px] text-slate-dim">{item.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="Nenhuma atividade recente"
              description="As ações da equipe aparecerão aqui em tempo real."
              className="mt-3.5 py-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}
