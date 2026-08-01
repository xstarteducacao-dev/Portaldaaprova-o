"use client";

import { useState } from "react";
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
import { consultoriaSchema, type ConsultoriaFormValues } from "./consultoria-schema";
import type { Database } from "@/types/database.types";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];
type EmpresaOption = { id: string; nome: string };
type ConsultorOption = { id: string; nome: string };

export function NewConsultoriaDialog({
  open,
  onOpenChange,
  empresas,
  consultores,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: EmpresaOption[];
  consultores: ConsultorOption[];
  onCreated: (consultoria: Consultoria) => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ConsultoriaFormValues>({
    resolver: zodResolver(consultoriaSchema),
    defaultValues: { formato: "online" },
  });

  async function onSubmit(values: ConsultoriaFormValues) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("consultorias")
      .insert({
        empresa_id: values.empresa_id || null,
        empresa_nome: values.empresa_nome,
        consultor_id: values.consultor_id,
        data_hora: new Date(values.data_hora).toISOString(),
        formato: values.formato,
        status: "agendada",
      })
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível criar a consultoria", { description: error?.message });
      return;
    }

    toast.success("Consultoria agendada com sucesso");
    onCreated(data as Consultoria);
    reset({ formato: "online", empresa_id: "", empresa_nome: "", consultor_id: "", data_hora: "" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova consultoria</DialogTitle>
          <DialogDescription>Agende uma nova consultoria.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          {empresas.length > 0 && (
            <div className="col-span-2">
              <Label htmlFor="empresa_id">Empresa cadastrada</Label>
              <Controller
                control={control}
                name="empresa_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const empresa = empresas.find((e) => e.id === value);
                      if (empresa) setValue("empresa_nome", empresa.nome);
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione (opcional)" />
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
            </div>
          )}
          <div className="col-span-2">
            <Label htmlFor="empresa_nome">Nome da empresa</Label>
            <Input id="empresa_nome" className="mt-1.5" {...register("empresa_nome")} />
            {errors.empresa_nome && (
              <p className="mt-1 text-xs text-red-400">{errors.empresa_nome.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="consultor_id">Consultor</Label>
            <Controller
              control={control}
              name="consultor_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o consultor" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.consultor_id && (
              <p className="mt-1 text-xs text-red-400">{errors.consultor_id.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="data_hora">Data e hora</Label>
            <Input id="data_hora" type="datetime-local" className="mt-1.5" {...register("data_hora")} />
            {errors.data_hora && (
              <p className="mt-1 text-xs text-red-400">{errors.data_hora.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="formato">Formato</Label>
            <Controller
              control={control}
              name="formato"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Agendar consultoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
