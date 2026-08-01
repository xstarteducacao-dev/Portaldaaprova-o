import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth-guard";
import { AccessDenied } from "@/components/shared/access-denied";
import { ConfiguracoesForm } from "@/components/configuracoes/configuracoes-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const { allowed } = await requireProfile(["administrador", "gerente"]);

  if (!allowed) {
    return (
      <AccessDenied description="Esta página é exclusiva para administradores e gerentes. Fale com um administrador do painel se precisar de acesso." />
    );
  }

  const supabase = await createClient();
  const { data: config } = await supabase.from("configuracoes").select("*").limit(1).maybeSingle();

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-[13.5px] text-slate">Dados gerais da empresa e integrações.</p>
      </div>
      <div className="mt-5">
        <ConfiguracoesForm initialConfig={config ?? null} />
      </div>
    </div>
  );
}
