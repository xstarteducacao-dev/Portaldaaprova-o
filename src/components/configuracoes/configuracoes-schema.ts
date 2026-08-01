import { z } from "zod";

export const configuracoesSchema = z.object({
  nome_empresa: z.string().min(2, "Informe o nome da empresa"),
  whatsapp: z.string().min(1, "Informe o WhatsApp"),
  dominio_painel: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  site_url: z.string().optional().or(z.literal("")),
  smtp_host: z.string().optional().or(z.literal("")),
  smtp_port: z.string().optional().or(z.literal("")),
  smtp_user: z.string().optional().or(z.literal("")),
  smtp_password: z.string().optional().or(z.literal("")),
  google_analytics_id: z.string().optional().or(z.literal("")),
  meta_pixel_id: z.string().optional().or(z.literal("")),
  fuso_horario: z.string().min(1),
  moeda: z.string().min(1),
});

export type ConfiguracoesFormValues = z.infer<typeof configuracoesSchema>;

export const FUSOS_HORARIOS = [
  { value: "America/Sao_Paulo", label: "Brasília (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
  { value: "America/Noronha", label: "Fernando de Noronha (GMT-2)" },
  { value: "America/Belem", label: "Belém (GMT-3)" },
  { value: "America/Cuiaba", label: "Cuiabá (GMT-4)" },
];

export const MOEDAS = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar americano (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];
