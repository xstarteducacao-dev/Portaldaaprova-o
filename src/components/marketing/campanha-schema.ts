import { z } from "zod";

export const campanhaSchema = z.object({
  cliente_id: z.string().min(1, "Selecione uma empresa"),
  nome: z.string().min(2, "Informe o nome da campanha"),
  tipo: z.enum(["google_ads", "meta_ads", "landing_pages", "social_media", "seo", "email_marketing"]),
  objetivo: z.string().optional().or(z.literal("")),
  investimento: z
    .string()
    .min(1, "Informe o investimento")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Informe um valor válido"),
  status: z.enum(["planejamento", "ativa", "pausada", "concluida"]),
  data_inicio: z.string().min(1, "Informe a data de início"),
  data_fim: z.string().optional().or(z.literal("")),
});

export type CampanhaFormValues = z.infer<typeof campanhaSchema>;

export const resultadosSchema = z.object({
  impressoes: z.string().optional().or(z.literal("")),
  cliques: z.string().optional().or(z.literal("")),
  conversoes: z.string().optional().or(z.literal("")),
  leads_gerados: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
});

export type ResultadosFormValues = z.infer<typeof resultadosSchema>;
