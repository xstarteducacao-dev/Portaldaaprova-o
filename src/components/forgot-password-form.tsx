"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível enviar o email", { description: error.message });
      return;
    }
    setSent(true);
    toast.success("Email de recuperação enviado");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.08]">
          <MailCheck className="h-6 w-6 text-accent" />
        </div>
        <p className="mb-6 text-sm text-slate">
          Se houver uma conta associada a <span className="text-white">{email}</span>, você
          receberá um link para redefinir sua senha em instantes.
        </p>
        <Link href="/login" className="text-sm text-accent hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-1.5 block text-[12.5px] text-slate">Email</label>
      <Input
        type="email"
        placeholder="voce@hubtech.com.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-6 h-[42px]"
      />

      <Button type="submit" disabled={loading} className="h-[46px] w-full text-[14.5px]">
        {loading ? "Enviando..." : "Enviar link de recuperação"}
        <ArrowRight size={16} />
      </Button>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px] text-slate hover:text-white"
      >
        <ArrowLeft size={13} />
        Voltar para o login
      </Link>
    </form>
  );
}
