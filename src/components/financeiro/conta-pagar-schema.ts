import { z } from "zod";

export const contaPagarSchema = z.object({
  fornecedor: z.string().min(2, "Informe o fornecedor"),
  categoria_id: z.string().min(1, "Selecione uma categoria"),
  descricao: z.string().min(2, "Informe a descrição"),
  valor: z
    .string()
    .min(1, "Informe o valor")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Informe um valor válido"),
  vencimento: z.string().min(1, "Informe o vencimento"),
});

export type ContaPagarFormValues = z.infer<typeof contaPagarSchema>;
