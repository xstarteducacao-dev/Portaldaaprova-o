import { z } from "zod";

export const leadSchema = z.object({
  empresa_nome: z.string().min(2, "Informe o nome da empresa"),
  responsavel: z.string().min(2, "Informe o responsável"),
  telefone: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  uf: z.string().max(2, "UF deve ter 2 letras").optional().or(z.literal("")),
  segmento: z.string().optional().or(z.literal("")),
  origem: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
