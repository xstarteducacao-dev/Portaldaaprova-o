import { z } from "zod";

export const consultoriaSchema = z.object({
  empresa_id: z.string().optional().or(z.literal("")),
  empresa_nome: z.string().min(2, "Informe o nome da empresa"),
  consultor_id: z.string().min(1, "Selecione um consultor"),
  data_hora: z.string().min(1, "Informe a data e hora"),
  formato: z.enum(["online", "presencial"]),
});

export type ConsultoriaFormValues = z.infer<typeof consultoriaSchema>;

export const conclusaoSchema = z.object({
  diagnostico: z.string().min(2, "Informe o diagnóstico"),
  branding: z.string().optional().or(z.literal("")),
  posicionamento: z.string().optional().or(z.literal("")),
  marketing: z.string().optional().or(z.literal("")),
  pontos_fortes: z.string().optional().or(z.literal("")),
  pontos_fracos: z.string().optional().or(z.literal("")),
  oportunidades: z.string().optional().or(z.literal("")),
  ameacas: z.string().optional().or(z.literal("")),
  plano_estrategico: z.string().optional().or(z.literal("")),
});

export type ConclusaoFormValues = z.infer<typeof conclusaoSchema>;
