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
import { sistemaSchema, type SistemaFormValues } from "./sistema-schema";
import { STATUS_SISTEMA_LABELS } from "./sistema-labels";
import type { Database } from "@/types/database.types";

type Sistema = Database["public"]["Tables"]["sistemas"]["Row"];
type EmpresaOption = { id: string; nome: string };

function sistemaToFormValues(sistema: Sistema): SistemaFormValues {
  return {
    cliente_id: sistema.cliente_id ?? "",
    sistema: sistema.sistema,
    versao: sistema.versao ?? "",
    status: sistema.status,
    documentacao_url: sistema.documentacao_url ?? "",
  };
}

export function SistemaFormDialog({
  open,
  onOpenChange,
  sistema,
  empresas,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sistema?: Sistema | null;
  empresas: EmpresaOption[];
  onSaved: (sistema: Sistema) => void;
}) {
  const isEdit = Boolean(sistema);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SistemaFormValues>({
    resolver: zodResolver(sistemaSchema),
    defaultValues: { status: "producao" },
  });

  useEffect(() => {
    if (open) {
      reset(sistema ? sistemaToFormValues(sistema) : { status: "producao" });
    }
  }, [open, sistema, reset]);

  async function onSubmit(values: SistemaFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      cliente_id: values.cliente_id,
      sistema: values.sistema,
      versao: values.versao || null,
      status: values.status,
      documentacao_url: values.documentacao_url || null,
    };

    const query =
      isEdit && sistema
        ? supabase.from("sistemas").update(payload).eq("id", sistema.id).select().single()
        : supabase.from("sistemas").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(
        isEdit ? "Não foi possível atualizar o sistema" : "Não foi possível criar o sistema",
        { description: error?.message }
      );
      return;
    }

    toast.success(isEdit ? "Sistema atualizado com sucesso" : "Sistema criado com sucesso");
    onSaved(data as Sistema);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar sistema" : "Novo sistema"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados do sistema." : "Cadastre um novo sistema."}
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
            <Label htmlFor="sistema">Sistema</Label>
            <Input id="sistema" className="mt-1.5" {...register("sistema")} />
            {errors.sistema && <p className="mt-1 text-xs text-red-400">{errors.sistema.message}</p>}
          </div>
          <div>
            <Label htmlFor="versao">Versão</Label>
            <Input id="versao" className="mt-1.5" {...register("versao")} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_SISTEMA_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="documentacao_url">URL da documentação</Label>
            <Input id="documentacao_url" className="mt-1.5" {...register("documentacao_url")} />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar sistema"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
