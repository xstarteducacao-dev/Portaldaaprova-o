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
import { marcarPagaSchema, type MarcarPagaFormValues } from "./conta-receber-schema";
import { FORMA_PAGAMENTO_LABELS } from "./financeiro-labels";

export function MarcarPagaDialog({
  open,
  onOpenChange,
  tabela,
  contaId,
  requerFormaPagamento = true,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabela: "contas_receber" | "contas_pagar";
  contaId: string | null;
  requerFormaPagamento?: boolean;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MarcarPagaFormValues>({
    resolver: zodResolver(marcarPagaSchema),
    defaultValues: { data_pagamento: new Date().toISOString().slice(0, 10) },
  });

  useEffect(() => {
    if (open) {
      reset({ data_pagamento: new Date().toISOString().slice(0, 10), forma_pagamento: undefined });
    }
  }, [open, reset]);

  async function onSubmit(values: MarcarPagaFormValues) {
    if (!contaId) return;
    setLoading(true);
    const supabase = createClient();

    const { error } =
      tabela === "contas_receber"
        ? await supabase
            .from("contas_receber")
            .update({
              status: "pago",
              data_pagamento: values.data_pagamento,
              forma_pagamento: requerFormaPagamento ? values.forma_pagamento : undefined,
            })
            .eq("id", contaId)
        : await supabase
            .from("contas_pagar")
            .update({ status: "pago", data_pagamento: values.data_pagamento })
            .eq("id", contaId);
    setLoading(false);

    if (error) {
      toast.error("Não foi possível marcar como paga", { description: error.message });
      return;
    }

    toast.success("Conta marcada como paga");
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Marcar como paga</DialogTitle>
          <DialogDescription>Confirme os dados do pagamento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3.5">
          {requerFormaPagamento && (
            <div>
              <Label htmlFor="forma_pagamento">Forma de pagamento</Label>
              <Controller
                control={control}
                name="forma_pagamento"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FORMA_PAGAMENTO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.forma_pagamento && (
                <p className="mt-1 text-xs text-red-400">{errors.forma_pagamento.message}</p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="data_pagamento">Data do pagamento</Label>
            <Input
              id="data_pagamento"
              type="date"
              className="mt-1.5"
              {...register("data_pagamento")}
            />
            {errors.data_pagamento && (
              <p className="mt-1 text-xs text-red-400">{errors.data_pagamento.message}</p>
            )}
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar pagamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
