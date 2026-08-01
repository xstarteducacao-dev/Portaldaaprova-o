import { z } from "zod";

export const siteSchema = z.object({
  cliente_id: z.string().min(1, "Selecione uma empresa"),
  dominio: z.string().min(3, "Informe o domínio"),
  hospedagem: z.string().optional().or(z.literal("")),
  ssl: z.enum(["ativo", "pendente", "expirado"]),
  status: z.enum(["online", "manutencao", "offline"]),
  ultima_atualizacao: z.string().optional().or(z.literal("")),
});

export type SiteFormValues = z.infer<typeof siteSchema>;
