export type TipoRelatorio =
  | "leads_conversao"
  | "consultorias_realizadas"
  | "projetos_status"
  | "financeiro";

export const TIPO_RELATORIO_LABELS: Record<TipoRelatorio, string> = {
  leads_conversao: "Leads e Conversão",
  consultorias_realizadas: "Consultorias Realizadas",
  projetos_status: "Projetos por Status",
  financeiro: "Financeiro — Receitas x Despesas",
};
