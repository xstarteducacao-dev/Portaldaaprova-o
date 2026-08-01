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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { leadSchema, type LeadFormValues } from "./lead-schema";
import type { Lead } from "./lead-card";

export function NewLeadDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (lead: Lead) => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema) });

  async function onSubmit(values: LeadFormValues) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        empresa_nome: values.empresa_nome,
        responsavel: values.responsavel,
        telefone: values.telefone || null,
        email: values.email || null,
        cidade: values.cidade || null,
        uf: values.uf || null,
        segmento: values.segmento || null,
        origem: values.origem || null,
        observacoes: values.observacoes || null,
        status: "novo",
      })
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível criar o lead", { description: error?.message });
      return;
    }

    toast.success("Lead criado com sucesso");
    onCreated(data as Lead);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>Cadastre um novo lead para o CRM.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2">
            <Label htmlFor="empresa_nome">Nome da empresa</Label>
            <Input id="empresa_nome" className="mt-1.5" {...register("empresa_nome")} />
            {errors.empresa_nome && (
              <p className="mt-1 text-xs text-red-400">{errors.empresa_nome.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="responsavel">Responsável</Label>
            <Input id="responsavel" className="mt-1.5" {...register("responsavel")} />
            {errors.responsavel && (
              <p className="mt-1 text-xs text-red-400">{errors.responsavel.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" className="mt-1.5" {...register("telefone")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1.5" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" className="mt-1.5" {...register("cidade")} />
          </div>
          <div>
            <Label htmlFor="uf">UF</Label>
            <Input id="uf" maxLength={2} className="mt-1.5" {...register("uf")} />
          </div>
          <div>
            <Label htmlFor="segmento">Segmento</Label>
            <Input id="segmento" className="mt-1.5" {...register("segmento")} />
          </div>
          <div>
            <Label htmlFor="origem">Origem</Label>
            <Input id="origem" className="mt-1.5" {...register("origem")} />
          </div>
          <div className="col-span-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" className="mt-1.5" {...register("observacoes")} />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
