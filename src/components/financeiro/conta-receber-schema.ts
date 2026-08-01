import { z } from "zod";

export const contaReceberSchema = z.object({
  cliente_id: z.string().min(1, "Selecione um cliente"),
  descricao: z.string().min(2, "Informe a descrição"),
  valor: z
    .string()
    .min(1, "Informe o valor")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Informe um valor válido"),
  vencimento: z.string().min(1, "Informe o vencimento"),
  parcelas: z
    .string()
    .min(1, "Informe as parcelas")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 1, "Informe um número válido"),
  parcela_atual: z
    .string()
    .min(1, "Informe a parcela atual")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 1, "Informe um número válido"),
});

export type ContaReceberFormValues = z.infer<typeof contaReceberSchema>;

export const marcarPagaSchema = z.object({
  forma_pagamento: z.enum(["pix", "boleto", "cartao", "dinheiro"], {
    message: "Selecione a forma de pagamento",
  }),
  data_pagamento: z.string().min(1, "Informe a data de pagamento"),
});

export type MarcarPagaFormValues = z.infer<typeof marcarPagaSchema>;
