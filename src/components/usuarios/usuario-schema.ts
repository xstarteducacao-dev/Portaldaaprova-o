import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(2, "Informe o nome"),
  telefone: z.string().optional().or(z.literal("")),
  perfil: z.enum([
    "administrador",
    "gerente",
    "consultor",
    "comercial",
    "financeiro",
    "marketing",
    "desenvolvedor",
  ]),
});

export type UsuarioFormValues = z.infer<typeof usuarioSchema>;

export const convidarUsuarioSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  nome: z.string().min(1, "Informe o nome"),
  telefone: z.string().optional().or(z.literal("")),
  perfil: z.enum([
    "administrador",
    "gerente",
    "consultor",
    "comercial",
    "financeiro",
    "marketing",
    "desenvolvedor",
  ]),
});

export type ConvidarUsuarioFormValues = z.infer<typeof convidarUsuarioSchema>;
