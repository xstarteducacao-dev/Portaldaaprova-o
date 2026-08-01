"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { conclusaoSchema, type ConclusaoFormValues } from "./consultoria-schema";
import type { Database } from "@/types/database.types";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];

const FIELDS: { name: keyof ConclusaoFormValues; label: string; required?: boolean }[] = [
  { name: "diagnostico", label: "Diagnóstico", required: true },
  { name: "branding", label: "Branding" },
  { name: "posicionamento", label: "Posicionamento" },
  { name: "marketing", label: "Marketing" },
  { name: "pontos_fortes", label: "Pontos fortes" },
  { name: "pontos_fracos", label: "Pontos fracos" },
  { name: "oportunidades", label: "Oportunidades" },
  { name: "ameacas", label: "Ameaças" },
  { name: "plano_estrategico", label: "Plano estratégico" },
];

export function ConclusaoDialog({
  open,
  onOpenChange,
  consultoria,
  onCompleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultoria: Consultoria | null;
  onCompleted: (consultoria: Consultoria) => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConclusaoFormValues>({ resolver: zodResolver(conclusaoSchema) });

  async function onSubmit(values: ConclusaoFormValues) {
    if (!consultoria) return;
    setLoading(true);
    const supabase = createClient();
    const payload = {
      status: "realizada" as const,
      diagnostico: values.diagnostico,
      branding: values.branding || null,
      posicionamento: values.posicionamento || null,
      marketing: values.marketing || null,
      pontos_fortes: values.pontos_fortes || null,
      pontos_fracos: values.pontos_fracos || null,
      oportunidades: values.oportunidades || null,
      ameacas: values.ameacas || null,
      plano_estrategico: values.plano_estrategico || null,
    };
    const { data, error } = await supabase
      .from("consultorias")
      .update(payload)
      .eq("id", consultoria.id)
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível concluir a consultoria", { description: error?.message });
      return;
    }

    toast.success("Consultoria marcada como realizada");
    onCompleted(data as Consultoria);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Concluir consultoria</DialogTitle>
          <DialogDescription>
            Preencha o diagnóstico e a análise SWOT para {consultoria?.empresa_nome}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          {FIELDS.map(({ name, label, required }) => (
            <div key={name} className={name === "diagnostico" || name === "plano_estrategico" ? "col-span-2" : ""}>
              <Label htmlFor={name}>
                {label}
                {required && <span className="text-red-400"> *</span>}
              </Label>
              <Textarea id={name} className="mt-1.5" {...register(name)} />
              {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]?.message}</p>}
            </div>
          ))}
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Concluir consultoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
