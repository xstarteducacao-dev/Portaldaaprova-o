import { z } from "zod";

export const empresaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da empresa"),
  razao_social: z.string().optional().or(z.literal("")),
  cnpj: z.string().optional().or(z.literal("")),
  segmento: z.string().optional().or(z.literal("")),
  funcionarios: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
  contato_nome: z.string().optional().or(z.literal("")),
  contato_cargo: z.string().optional().or(z.literal("")),
  contato_telefone: z.string().optional().or(z.literal("")),
  contato_email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  site: z.string().optional().or(z.literal("")),
  cep: z.string().optional().or(z.literal("")),
  logradouro: z.string().optional().or(z.literal("")),
  numero: z.string().optional().or(z.literal("")),
  bairro: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  uf: z.string().max(2, "UF deve ter 2 letras").optional().or(z.literal("")),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
