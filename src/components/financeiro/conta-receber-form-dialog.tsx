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
import { contaReceberSchema, type ContaReceberFormValues } from "./conta-receber-schema";
import type { Database } from "@/types/database.types";

type ContaReceber = Database["public"]["Tables"]["contas_receber"]["Row"];
type EmpresaOption = { id: string; nome: string };

function toFormValues(conta: ContaReceber): ContaReceberFormValues {
  return {
    cliente_id: conta.cliente_id ?? "",
    descricao: conta.descricao,
    valor: String(conta.valor),
    vencimento: conta.vencimento,
    parcelas: String(conta.parcelas),
    parcela_atual: String(conta.parcela_atual),
  };
}

export function ContaReceberFormDialog({
  open,
  onOpenChange,
  conta,
  empresas,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta?: ContaReceber | null;
  empresas: EmpresaOption[];
  onSaved: (conta: ContaReceber) => void;
}) {
  const isEdit = Boolean(conta);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContaReceberFormValues>({
    resolver: zodResolver(contaReceberSchema),
    defaultValues: { parcelas: "1", parcela_atual: "1" },
  });

  useEffect(() => {
    if (open) {
      reset(conta ? toFormValues(conta) : { cliente_id: "", descricao: "", valor: "", vencimento: "", parcelas: "1", parcela_atual: "1" });
    }
  }, [open, conta, reset]);

  async function onSubmit(values: ContaReceberFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      cliente_id: values.cliente_id,
      descricao: values.descricao,
      valor: Number(values.valor),
      vencimento: values.vencimento,
      parcelas: Number(values.parcelas),
      parcela_atual: Number(values.parcela_atual),
    };

    const query =
      isEdit && conta
        ? supabase.from("contas_receber").update(payload).eq("id", conta.id).select().single()
        : supabase.from("contas_receber").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(isEdit ? "Não foi possível atualizar a conta" : "Não foi possível criar a conta", {
        description: error?.message,
      });
      return;
    }

    toast.success(isEdit ? "Conta atualizada com sucesso" : "Conta criada com sucesso");
    onSaved(data as ContaReceber);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar conta a receber" : "Nova conta a receber"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados da conta." : "Cadastre uma nova conta a receber."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Controller
              control={control}
              name="cliente_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cliente_id && (
              <p className="mt-1 text-xs text-red-400">{errors.cliente_id.message}</p>
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
          <div>
            <Label htmlFor="parcelas">Parcelas</Label>
            <Input id="parcelas" type="number" min={1} className="mt-1.5" {...register("parcelas")} />
          </div>
          <div>
            <Label htmlFor="parcela_atual">Parcela atual</Label>
            <Input
              id="parcela_atual"
              type="number"
              min={1}
              className="mt-1.5"
              {...register("parcela_atual")}
            />
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
