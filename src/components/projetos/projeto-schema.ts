import { z } from "zod";

export const projetoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do projeto"),
  cliente_id: z.string().optional().or(z.literal("")),
  responsavel_id: z.string().optional().or(z.literal("")),
  equipe: z.array(z.string()),
  tipo: z.enum([
    "site",
    "landing_page",
    "sistema",
    "trafego_pago",
    "branding",
    "social_media",
    "consultoria",
    "seo",
    "automacao",
  ]),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]),
  prazo: z.string().optional().or(z.literal("")),
  progresso: z.coerce.number().min(0).max(100),
  descricao: z.string().optional().or(z.literal("")),
});

export type ProjetoFormValues = z.infer<typeof projetoSchema>;

export const projetoEditSchema = projetoSchema.extend({
  status: z.enum(["a_fazer", "em_andamento", "em_revisao", "concluido"]),
});

export type ProjetoEditFormValues = z.infer<typeof projetoEditSchema>;
