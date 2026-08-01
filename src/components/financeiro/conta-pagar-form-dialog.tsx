"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { contaPagarSchema, type ContaPagarFormValues } from "./conta-pagar-schema";
import type { Database } from "@/types/database.types";

type ContaPagar = Database["public"]["Tables"]["contas_pagar"]["Row"];
type CategoriaOption = { id: string; nome: string };

function toFormValues(conta: ContaPagar): ContaPagarFormValues {
  return {
    fornecedor: conta.fornecedor,
    categoria_id: conta.categoria_id ?? "",
    descricao: conta.descricao,
    valor: String(conta.valor),
    vencimento: conta.vencimento,
  };
}

export function ContaPagarFormDialog({
  open,
  onOpenChange,
  conta,
  categorias,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta?: ContaPagar | null;
  categorias: CategoriaOption[];
  onSaved: (conta: ContaPagar) => void;
}) {
  const isEdit = Boolean(conta);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContaPagarFormValues>({
    resolver: zodResolver(contaPagarSchema),
  });

  useEffect(() => {
    if (open) {
      reset(conta ? toFormValues(conta) : { fornecedor: "", categoria_id: "", descricao: "", valor: "", vencimento: "" });
    }
  }, [open, conta, reset]);

  async function onSubmit(values: ContaPagarFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      fornecedor: values.fornecedor,
      categoria_id: values.categoria_id,
      descricao: values.descricao,
      valor: Number(values.valor),
      vencimento: values.vencimento,
    };

    const query =
      isEdit && conta
        ? supabase.from("contas_pagar").update(payload).eq("id", conta.id).select().single()
        : supabase.from("contas_pagar").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(isEdit ? "Não foi possível atualizar a conta" : "Não foi possível criar a conta", {
        description: error?.message,
      });
      return;
    }

    toast.success(isEdit ? "Conta atualizada com sucesso" : "Conta criada com sucesso");
    onSaved(data as ContaPagar);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar conta a pagar" : "Nova conta a pagar"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados da conta." : "Cadastre uma nova conta a pagar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input id="fornecedor" className="mt-1.5" {...register("fornecedor")} />
            {errors.fornecedor && (
              <p className="mt-1 text-xs text-red-400">{errors.fornecedor.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="categoria_id">Categoria</Label>
            <Controller
              control={control}
              name="categoria_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoria_id && (
              <p className="mt-1 text-xs text-red-400">{errors.categoria_id.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" className="mt-1.5" {...register("descricao")} />
            {errors.descricao && <p className="mt-1 text-xs text-red-400">{errors.descricao.message}</p>}
          </div>
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input id="valor" type="number" step="0.01" className="mt-1.5" {...register("valor")} />
            {errors.valor && <p className="mt-1 text-xs text-red-400">{errors.valor.message}</p>}
          </div>
          <div>
            <Label htmlFor="vencimento">Vencimento</Label>
            <Input id="vencimento" type="date" className="mt-1.5" {...register("vencimento")} />
            {errors.vencimento && (
              <p className="mt-1 text-xs text-red-400">{errors.vencimento.message}</p>
            )}
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
