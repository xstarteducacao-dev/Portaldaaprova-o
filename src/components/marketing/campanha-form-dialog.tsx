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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { campanhaSchema, type CampanhaFormValues } from "./campanha-schema";
import { TIPO_LABELS, STATUS_LABELS } from "./campanha-labels";
import type { Database } from "@/types/database.types";

type Campanha = Database["public"]["Tables"]["campanhas"]["Row"];
type EmpresaOption = { id: string; nome: string };

function campanhaToFormValues(campanha: Campanha): CampanhaFormValues {
  return {
    cliente_id: campanha.cliente_id ?? "",
    nome: campanha.nome,
    tipo: campanha.tipo,
    objetivo: campanha.objetivo ?? "",
    investimento: String(campanha.investimento),
    status: campanha.status,
    data_inicio: campanha.data_inicio,
    data_fim: campanha.data_fim ?? "",
  };
}

export function CampanhaFormDialog({
  open,
  onOpenChange,
  campanha,
  empresas,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campanha?: Campanha | null;
  empresas: EmpresaOption[];
  onSaved: (campanha: Campanha) => void;
}) {
  const isEdit = Boolean(campanha);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CampanhaFormValues>({
    resolver: zodResolver(campanhaSchema),
    defaultValues: { tipo: "google_ads", status: "planejamento" },
  });

  useEffect(() => {
    if (open) {
      reset(campanha ? campanhaToFormValues(campanha) : { tipo: "google_ads", status: "planejamento" });
    }
  }, [open, campanha, reset]);

  async function onSubmit(values: CampanhaFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      cliente_id: values.cliente_id,
      nome: values.nome,
      tipo: values.tipo,
      objetivo: values.objetivo || null,
      investimento: Number(values.investimento),
      status: values.status,
      data_inicio: values.data_inicio,
      data_fim: values.data_fim || null,
    };

    const query =
      isEdit && campanha
        ? supabase.from("campanhas").update(payload).eq("id", campanha.id).select().single()
        : supabase.from("campanhas").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(
        isEdit ? "Não foi possível atualizar a campanha" : "Não foi possível criar a campanha",
        { description: error?.message }
      );
      return;
    }

    toast.success(isEdit ? "Campanha atualizada com sucesso" : "Campanha criada com sucesso");
    onSaved(data as Campanha);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar campanha" : "Nova campanha"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados da campanha." : "Cadastre uma nova campanha de marketing."}
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
            <Label htmlFor="nome">Nome da campanha</Label>
            <Input id="nome" className="mt-1.5" {...register("nome")} />
            {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome.message}</p>}
          </div>
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPO_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="investimento">Investimento (R$)</Label>
            <Input
              id="investimento"
              type="number"
              step="0.01"
              min="0"
              className="mt-1.5"
              {...register("investimento")}
            />
            {errors.investimento && (
              <p className="mt-1 text-xs text-red-400">{errors.investimento.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="data_inicio">Data de início</Label>
            <Input id="data_inicio" type="date" className="mt-1.5" {...register("data_inicio")} />
            {errors.data_inicio && (
              <p className="mt-1 text-xs text-red-400">{errors.data_inicio.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="data_fim">Data de fim</Label>
            <Input id="data_fim" type="date" className="mt-1.5" {...register("data_fim")} />
          </div>
          <div className="col-span-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Textarea id="objetivo" className="mt-1.5" {...register("objetivo")} />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar campanha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
