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
import { usuarioSchema, type UsuarioFormValues } from "./usuario-schema";
import { PERFIL_LABELS } from "./usuario-labels";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function profileToFormValues(profile: Profile): UsuarioFormValues {
  return {
    nome: profile.nome,
    telefone: profile.telefone ?? "",
    perfil: profile.perfil,
  };
}

export function UsuarioFormDialog({
  open,
  onOpenChange,
  profile,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onSaved: (profile: Profile) => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { perfil: "consultor" },
  });

  useEffect(() => {
    if (open && profile) {
      reset(profileToFormValues(profile));
    }
  }, [open, profile, reset]);

  async function onSubmit(values: UsuarioFormValues) {
    if (!profile) return;
    setLoading(true);
    const supabase = createClient();
    const payload = {
      nome: values.nome,
      telefone: values.telefone || null,
      perfil: values.perfil,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", profile.id)
      .select()
      .single();

    setLoading(false);

    if (error || !data) {
      toast.error("Não foi possível atualizar o usuário", { description: error?.message });
      return;
    }

    toast.success("Usuário atualizado com sucesso");
    onSaved(data as Profile);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Atualize os dados do usuário.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3.5">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" className="mt-1.5" {...register("nome")} />
            {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome.message}</p>}
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" className="mt-1.5" {...register("telefone")} />
          </div>
          <div>
            <Label htmlFor="perfil">Perfil</Label>
            <Controller
              control={control}
              name="perfil"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PERFIL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
