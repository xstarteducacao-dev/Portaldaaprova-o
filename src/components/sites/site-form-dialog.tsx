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
import { siteSchema, type SiteFormValues } from "./site-schema";
import { SSL_LABELS, STATUS_SITE_LABELS } from "./site-labels";
import type { Database } from "@/types/database.types";

type Site = Database["public"]["Tables"]["sites"]["Row"];
type EmpresaOption = { id: string; nome: string };

function siteToFormValues(site: Site): SiteFormValues {
  return {
    cliente_id: site.cliente_id ?? "",
    dominio: site.dominio,
    hospedagem: site.hospedagem ?? "",
    ssl: site.ssl,
    status: site.status,
    ultima_atualizacao: site.ultima_atualizacao ?? "",
  };
}

export function SiteFormDialog({
  open,
  onOpenChange,
  site,
  empresas,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: Site | null;
  empresas: EmpresaOption[];
  onSaved: (site: Site) => void;
}) {
  const isEdit = Boolean(site);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: { ssl: "ativo", status: "online" },
  });

  useEffect(() => {
    if (open) {
      reset(site ? siteToFormValues(site) : { ssl: "ativo", status: "online" });
    }
  }, [open, site, reset]);

  async function onSubmit(values: SiteFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      cliente_id: values.cliente_id,
      dominio: values.dominio,
      hospedagem: values.hospedagem || null,
      ssl: values.ssl,
      status: values.status,
      ultima_atualizacao: values.ultima_atualizacao || null,
    };

    const query =
      isEdit && site
        ? supabase.from("sites").update(payload).eq("id", site.id).select().single()
        : supabase.from("sites").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(isEdit ? "Não foi possível atualizar o site" : "Não foi possível criar o site", {
        description: error?.message,
      });
      return;
    }

    toast.success(isEdit ? "Site atualizado com sucesso" : "Site criado com sucesso");
    onSaved(data as Site);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar site" : "Novo site"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados do site." : "Cadastre um novo site sob gestão."}
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
            <Label htmlFor="dominio">Domínio</Label>
            <Input id="dominio" placeholder="exemplo.com.br" className="mt-1.5" {...register("dominio")} />
            {errors.dominio && <p className="mt-1 text-xs text-red-400">{errors.dominio.message}</p>}
          </div>
          <div className="col-span-2">
            <Label htmlFor="hospedagem">Hospedagem</Label>
            <Input id="hospedagem" className="mt-1.5" {...register("hospedagem")} />
          </div>
          <div>
            <Label htmlFor="ssl">SSL</Label>
            <Controller
              control={control}
              name="ssl"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SSL_LABELS).map(([value, label]) => (
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
                    {Object.entries(STATUS_SITE_LABELS).map(([value, label]) => (
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
            <Label htmlFor="ultima_atualizacao">Última atualização</Label>
            <Input
              id="ultima_atualizacao"
              type="date"
              className="mt-1.5"
              {...register("ultima_atualizacao")}
            />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
