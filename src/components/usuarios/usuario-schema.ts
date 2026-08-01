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
