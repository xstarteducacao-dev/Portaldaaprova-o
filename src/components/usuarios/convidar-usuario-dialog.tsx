"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { convidarUsuarioSchema, type ConvidarUsuarioFormValues } from "./usuario-schema";
import { PERFIL_LABELS } from "./usuario-labels";

export function ConvidarUsuarioDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ConvidarUsuarioFormValues>({
    resolver: zodResolver(convidarUsuarioSchema),
    defaultValues: { email: "", nome: "", telefone: "", perfil: "consultor" },
  });

  async function onSubmit(values: ConvidarUsuarioFormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios/convidar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Não foi possível enviar o convite");
        return;
      }

      toast.success("Convite enviado", {
        description: "O usuário aparecerá na lista após aceitar o convite.",
      });
      reset();
      onOpenChange(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar usuário</DialogTitle>
          <DialogDescription>
            Um e-mail de convite será enviado. O usuário define a senha ao aceitar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3.5">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" className="mt-1.5" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
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
              {loading ? "Enviando..." : "Enviar convite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
