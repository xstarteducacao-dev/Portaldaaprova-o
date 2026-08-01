"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import {
  configuracoesSchema,
  FUSOS_HORARIOS,
  MOEDAS,
  type ConfiguracoesFormValues,
} from "./configuracoes-schema";
import type { Database } from "@/types/database.types";

type Configuracoes = Database["public"]["Tables"]["configuracoes"]["Row"];

function toFormValues(config: Configuracoes | null): ConfiguracoesFormValues {
  return {
    nome_empresa: config?.nome_empresa ?? "",
    whatsapp: config?.whatsapp ?? "",
    dominio_painel: config?.dominio_painel ?? "",
    instagram: config?.instagram ?? "",
    facebook: config?.facebook ?? "",
    linkedin: config?.linkedin ?? "",
    site_url: config?.site_url ?? "",
    smtp_host: config?.smtp_host ?? "",
    smtp_port: config?.smtp_port != null ? String(config.smtp_port) : "",
    smtp_user: config?.smtp_user ?? "",
    smtp_password: config?.smtp_password ?? "",
    google_analytics_id: config?.google_analytics_id ?? "",
    meta_pixel_id: config?.meta_pixel_id ?? "",
    fuso_horario: config?.fuso_horario ?? "America/Sao_Paulo",
    moeda: config?.moeda ?? "BRL",
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
      <div className="text-[14.5px] font-semibold text-white">{title}</div>
      <p className="mt-1 text-[12.5px] text-slate">{description}</p>
      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function ConfiguracoesForm({ initialConfig }: { initialConfig: Configuracoes | null }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfiguracoesFormValues>({
    resolver: zodResolver(configuracoesSchema),
    defaultValues: toFormValues(initialConfig),
  });

  const fusoHorario = watch("fuso_horario");
  const moeda = watch("moeda");

  async function onSubmit(values: ConfiguracoesFormValues) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      nome_empresa: values.nome_empresa,
      whatsapp: values.whatsapp,
      dominio_painel: values.dominio_painel || null,
      instagram: values.instagram || null,
      facebook: values.facebook || null,
      linkedin: values.linkedin || null,
      site_url: values.site_url || null,
      smtp_host: values.smtp_host || null,
      smtp_port: values.smtp_port ? Number(values.smtp_port) : null,
      smtp_user: values.smtp_user || null,
      smtp_password: values.smtp_password || null,
      google_analytics_id: values.google_analytics_id || null,
      meta_pixel_id: values.meta_pixel_id || null,
      fuso_horario: values.fuso_horario,
      moeda: values.moeda,
      updated_at: new Date().toISOString(),
    };

    const query = initialConfig
      ? supabase.from("configuracoes").update(payload).eq("id", initialConfig.id)
      : supabase.from("configuracoes").insert(payload);

    const { error } = await query;
    setLoading(false);

    if (error) {
      toast.error("Não foi possível salvar as configurações", { description: error.message });
      return;
    }

    toast.success("Configurações salvas com sucesso");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title="Dados da empresa" description="Identificação da empresa exibida no painel.">
        <div>
          <Label htmlFor="nome_empresa">Nome da empresa</Label>
          <Input id="nome_empresa" className="mt-1.5" {...register("nome_empresa")} />
          {errors.nome_empresa && (
            <p className="mt-1 text-xs text-red-400">{errors.nome_empresa.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" className="mt-1.5" {...register("whatsapp")} />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-400">{errors.whatsapp.message}</p>}
        </div>
        <div>
          <Label htmlFor="dominio_painel">Domínio do painel</Label>
          <Input id="dominio_painel" className="mt-1.5" {...register("dominio_painel")} />
        </div>
      </Section>

      <Section title="Redes sociais" description="Links exibidos em materiais e integrações.">
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
          <Label htmlFor="site_url">Site</Label>
          <Input id="site_url" className="mt-1.5" {...register("site_url")} />
        </div>
      </Section>

      <Section title="E-mail (SMTP)" description="Configuração usada para envio de e-mails do sistema.">
        <div>
          <Label htmlFor="smtp_host">Host SMTP</Label>
          <Input id="smtp_host" className="mt-1.5" {...register("smtp_host")} />
        </div>
        <div>
          <Label htmlFor="smtp_port">Porta SMTP</Label>
          <Input id="smtp_port" type="number" className="mt-1.5" {...register("smtp_port")} />
        </div>
        <div>
          <Label htmlFor="smtp_user">Usuário SMTP</Label>
          <Input id="smtp_user" className="mt-1.5" {...register("smtp_user")} />
        </div>
        <div>
          <Label htmlFor="smtp_password">Senha SMTP</Label>
          <Input id="smtp_password" type="password" className="mt-1.5" {...register("smtp_password")} />
        </div>
      </Section>

      <Section title="Integrações" description="IDs de rastreamento usados em marketing.">
        <div>
          <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
          <Input id="google_analytics_id" className="mt-1.5" {...register("google_analytics_id")} />
        </div>
        <div>
          <Label htmlFor="meta_pixel_id">Meta Pixel ID</Label>
          <Input id="meta_pixel_id" className="mt-1.5" {...register("meta_pixel_id")} />
        </div>
      </Section>

      <Section title="Preferências" description="Fuso horário e moeda usados no painel.">
        <div>
          <Label htmlFor="fuso_horario">Fuso horário</Label>
          <Select value={fusoHorario} onValueChange={(v) => setValue("fuso_horario", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FUSOS_HORARIOS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="moeda">Moeda</Label>
          <Select value={moeda} onValueChange={(v) => setValue("moeda", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOEDAS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
