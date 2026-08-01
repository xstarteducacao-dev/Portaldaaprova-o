import { z } from "zod";

export const sistemaSchema = z.object({
  cliente_id: z.string().min(1, "Selecione uma empresa"),
  sistema: z.string().min(2, "Informe o nome do sistema"),
  versao: z.string().optional().or(z.literal("")),
  status: z.enum(["producao", "desenvolvimento", "descontinuado"]),
  documentacao_url: z.string().optional().or(z.literal("")),
});

export type SistemaFormValues = z.infer<typeof sistemaSchema>;

export const chamadoSchema = z.object({
  titulo: z.string().min(2, "Informe o título"),
  descricao: z.string().optional().or(z.literal("")),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]),
});

export type ChamadoFormValues = z.infer<typeof chamadoSchema>;
