"use client";

import { useEffect, useState } from "react";
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
import { empresaSchema, type EmpresaFormValues } from "./empresa-schema";
import type { Database } from "@/types/database.types";

type Empresa = Database["public"]["Tables"]["empresas"]["Row"];

function empresaToFormValues(empresa: Empresa): EmpresaFormValues {
  const contato = empresa.contatos?.[0];
  const redes = empresa.redes_sociais ?? {};
  const endereco = empresa.endereco ?? {};
  return {
    nome: empresa.nome,
    razao_social: empresa.razao_social ?? "",
    cnpj: empresa.cnpj ?? "",
    segmento: empresa.segmento ?? "",
    funcionarios: empresa.funcionarios ?? "",
    observacoes: empresa.observacoes ?? "",
    contato_nome: contato?.nome ?? "",
    contato_cargo: contato?.cargo ?? "",
    contato_telefone: contato?.telefone ?? "",
    contato_email: contato?.email ?? "",
    instagram: redes.instagram ?? "",
    facebook: redes.facebook ?? "",
    linkedin: redes.linkedin ?? "",
    site: redes.site ?? "",
    cep: endereco.cep ?? "",
    logradouro: endereco.logradouro ?? "",
    numero: endereco.numero ?? "",
    bairro: endereco.bairro ?? "",
    cidade: endereco.cidade ?? "",
    uf: endereco.uf ?? "",
  };
}

function formValuesToPayload(values: EmpresaFormValues) {
  const contatos =
    values.contato_nome && values.contato_nome.trim()
      ? [
          {
            nome: values.contato_nome,
            cargo: values.contato_cargo || undefined,
            telefone: values.contato_telefone || undefined,
            email: values.contato_email || undefined,
          },
        ]
      : [];

  return {
    nome: values.nome,
    razao_social: values.razao_social || null,
    cnpj: values.cnpj || null,
    segmento: values.segmento || null,
    funcionarios: values.funcionarios || null,
    observacoes: values.observacoes || null,
    contatos,
    redes_sociais: {
      instagram: values.instagram || undefined,
      facebook: values.facebook || undefined,
      linkedin: values.linkedin || undefined,
      site: values.site || undefined,
    },
    endereco: {
      cep: values.cep || undefined,
      logradouro: values.logradouro || undefined,
      numero: values.numero || undefined,
      bairro: values.bairro || undefined,
      cidade: values.cidade || undefined,
      uf: values.uf || undefined,
    },
  };
}

export function EmpresaFormDialog({
  open,
  onOpenChange,
  empresa,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa?: Empresa | null;
  onSaved: (empresa: Empresa) => void;
}) {
  const isEdit = Boolean(empresa);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmpresaFormValues>({ resolver: zodResolver(empresaSchema) });

  useEffect(() => {
    if (open) {
      reset(empresa ? empresaToFormValues(empresa) : undefined);
    }
  }, [open, empresa, reset]);

  async function onSubmit(values: EmpresaFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = formValuesToPayload(values);

    const query = isEdit && empresa
      ? supabase.from("empresas").update(payload).eq("id", empresa.id).select().single()
      : supabase.from("empresas").insert(payload).select().single();

    const { data, error } = await query;
    setLoading(false);

    if (error || !data) {
      toast.error(
        isEdit ? "Não foi possível atualizar a empresa" : "Não foi possível criar a empresa",
        { description: error?.message }
      );
      return;
    }

    toast.success(isEdit ? "Empresa atualizada com sucesso" : "Empresa criada com sucesso");
    onSaved(data as Empresa);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar empresa" : "Nova empresa"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados da empresa." : "Cadastre uma nova empresa cliente ou prospect."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" className="mt-1.5" {...register("nome")} />
            {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome.message}</p>}
          </div>
          <div>
            <Label htmlFor="razao_social">Razão social</Label>
            <Input id="razao_social" className="mt-1.5" {...register("razao_social")} />
          </div>
          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" className="mt-1.5" {...register("cnpj")} />
          </div>
          <div>
            <Label htmlFor="segmento">Segmento</Label>
            <Input id="segmento" className="mt-1.5" {...register("segmento")} />
          </div>
          <div>
            <Label htmlFor="funcionarios">Funcionários</Label>
            <Input id="funcionarios" placeholder="Ex: 1-10" className="mt-1.5" {...register("funcionarios")} />
          </div>

          <div className="col-span-2 mt-1 text-[12.5px] font-semibold text-slate">Contato principal</div>
          <div>
            <Label htmlFor="contato_nome">Nome do contato</Label>
            <Input id="contato_nome" className="mt-1.5" {...register("contato_nome")} />
          </div>
          <div>
            <Label htmlFor="contato_cargo">Cargo</Label>
            <Input id="contato_cargo" className="mt-1.5" {...register("contato_cargo")} />
          </div>
          <div>
            <Label htmlFor="contato_telefone">Telefone</Label>
            <Input id="contato_telefone" className="mt-1.5" {...register("contato_telefone")} />
          </div>
          <div>
            <Label htmlFor="contato_email">Email</Label>
            <Input id="contato_email" type="email" className="mt-1.5" {...register("contato_email")} />
            {errors.contato_email && (
              <p className="mt-1 text-xs text-red-400">{errors.contato_email.message}</p>
            )}
          </div>

          <div className="col-span-2 mt-1 text-[12.5px] font-semibold text-slate">Redes sociais</div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" className="mt-1.5" {...register("instagram")} />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" className="mt-1.5" {...register("facebook")} />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" className="mt-1.5" {...register("linkedin")} />
          </div>
          <div>
            <Label htmlFor="site">Site</Label>
            <Input id="site" className="mt-1.5" {...register("site")} />
          </div>

          <div className="col-span-2 mt-1 text-[12.5px] font-semibold text-slate">Endereço</div>
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" className="mt-1.5" {...register("cep")} />
          </div>
          <div>
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input id="logradouro" className="mt-1.5" {...register("logradouro")} />
          </div>
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" className="mt-1.5" {...register("numero")} />
          </div>
          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" className="mt-1.5" {...register("bairro")} />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" className="mt-1.5" {...register("cidade")} />
          </div>
          <div>
            <Label htmlFor="uf">UF</Label>
            <Input id="uf" maxLength={2} className="mt-1.5" {...register("uf")} />
            {errors.uf && <p className="mt-1 text-xs text-red-400">{errors.uf.message}</p>}
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
              {loading ? "Salvando..." : "Salvar empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
