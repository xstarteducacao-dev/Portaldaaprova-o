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
import { EquipeSelect } from "./equipe-select";
import { TIPO_LABELS, STATUS_LABELS } from "./projeto-labels";
import { projetoEditSchema, type ProjetoEditFormValues } from "./projeto-schema";
import type { EmpresaOption, ProfileOption, Projeto } from "./types";

const EMPTY_VALUES: ProjetoEditFormValues = {
  nome: "",
  cliente_id: "",
  responsavel_id: "",
  equipe: [],
  tipo: "site",
  status: "a_fazer",
  prioridade: "media",
  prazo: "",
  progresso: 0,
  descricao: "",
};

export function ProjetoFormDialog({
  open,
  onOpenChange,
  empresas,
  profiles,
  projeto,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  projeto?: Projeto | null;
  onSaved: (projeto: Projeto, isNew: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(projeto);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projetoEditSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    if (projeto) {
      reset({
        nome: projeto.nome,
        cliente_id: projeto.cliente_id ?? "",
        responsavel_id: projeto.responsavel_id ?? "",
        equipe: projeto.equipe,
        tipo: projeto.tipo,
        status: projeto.status,
        prioridade: projeto.prioridade,
        prazo: projeto.prazo ?? "",
        progresso: projeto.progresso,
        descricao: projeto.descricao ?? "",
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open, projeto, reset]);

  async function onSubmit(values: ProjetoEditFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      nome: values.nome,
      cliente_id: values.cliente_id || null,
      responsavel_id: values.responsavel_id || null,
      equipe: values.equipe,
      tipo: values.tipo,
      prioridade: values.prioridade,
      prazo: values.prazo || null,
      progresso: values.progresso,
      descricao: values.descricao || null,
    };

    if (isEditing && projeto) {
      const { data, error } = await supabase
        .from("projetos")
        .update({ ...payload, status: values.status })
        .eq("id", projeto.id)
        .select()
        .single();
      setLoading(false);
      if (error || !data) {
        toast.error("Não foi possível atualizar o projeto", { description: error?.message });
        return;
      }
      toast.success("Projeto atualizado com sucesso");
      onSaved(data as Projeto, false);
    } else {
      const { data, error } = await supabase
        .from("projetos")
        .insert({ ...payload, status: "a_fazer" })
        .select()
        .single();
      setLoading(false);
      if (error || !data) {
        toast.error("Não foi possível criar o projeto", { description: error?.message });
        return;
      }
      toast.success("Projeto criado com sucesso");
      onSaved(data as Projeto, true);
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar projeto" : "Novo projeto"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do projeto." : "Cadastre um novo projeto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid max-h-[70vh] grid-cols-2 gap-3.5 overflow-y-auto pr-1">
          <div className="col-span-2">
            <Label htmlFor="nome">Nome do projeto</Label>
            <Input id="nome" className="mt-1.5" {...register("nome")} />
            {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome.message}</p>}
          </div>
          <div>
            <Label htmlFor="cliente_id">Cliente</Label>
            <Controller
              control={control}
              name="cliente_id"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
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
          <div>
            <Label htmlFor="responsavel_id">Responsável</Label>
            <Controller
              control={control}
              name="responsavel_id"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-2">
            <Label>Equipe</Label>
            <div className="mt-1.5">
              <Controller
                control={control}
                name="equipe"
                render={({ field }) => (
                  <EquipeSelect profiles={profiles} value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
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
            <Label htmlFor="prioridade">Prioridade</Label>
            <Controller
              control={control}
              name="prioridade"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {isEditing && (
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
          )}
          <div>
            <Label htmlFor="prazo">Prazo</Label>
            <Input id="prazo" type="date" className="mt-1.5" {...register("prazo")} />
          </div>
          <div>
            <Label htmlFor="progresso">Progresso (%)</Label>
            <Input
              id="progresso"
              type="number"
              min={0}
              max={100}
              className="mt-1.5"
              {...register("progresso")}
            />
            {errors.progresso && <p className="mt-1 text-xs text-red-400">{errors.progresso.message}</p>}
          </div>
          <div className="col-span-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" className="mt-1.5" {...register("descricao")} />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar projeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
