"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível entrar", {
        description: "Verifique seu email e senha e tente novamente.",
      });
      return;
    }

    toast.success("Login realizado com sucesso");
    router.push("/dashboard");
    router.refresh();
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
        className="mb-[18px] h-[42px]"
      />

      <label className="mb-1.5 block text-[12.5px] text-slate">Senha</label>
      <div className="relative mb-3.5">
        <Input
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="h-[42px] pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          aria-label="Mostrar senha"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-white"
        >
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between text-[12.5px]">
        <label className="flex cursor-pointer items-center gap-2 text-slate">
          <Checkbox checked={lembrar} onCheckedChange={(v) => setLembrar(!!v)} />
          Lembrar acesso
        </label>
        <Link href="/esqueci-senha" className="text-accent hover:underline">
          Esqueci minha senha
        </Link>
      </div>

      <Button type="submit" disabled={loading} className="h-[46px] w-full text-[14.5px]">
        {loading ? "Entrando..." : "Entrar"}
        <ArrowRight size={16} />
      </Button>

      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-dim">
        <ShieldCheck size={12} />
        Conexão segura
      </div>
    </form>
  );
}
