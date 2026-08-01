import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const convidarSchema = z.object({
  email: z.string().email("E-mail inválido"),
  nome: z.string().min(1, "Informe o nome"),
  telefone: z.string().optional(),
  perfil: z.enum([
    "administrador",
    "gerente",
    "consultor",
    "comercial",
    "financeiro",
    "marketing",
    "desenvolvedor",
  ]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("perfil")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.perfil !== "administrador") {
    return NextResponse.json(
      { error: "Apenas administradores podem convidar usuários." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = convidarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, nome, telefone, perfil } = parsed.data;
  const admin = createAdminClient();

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { nome, telefone: telefone || null, perfil },
  });

  if (inviteError || !invited?.user) {
    const message = inviteError?.message?.includes("already been registered")
      ? "Este e-mail já está cadastrado."
      : "Não foi possível enviar o convite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // O trigger handle_new_user cria a linha em profiles automaticamente a partir dos
  // metadados do auth.users, mas por padrão pode não preencher todos os campos.
  // Fazemos um update de reforço aqui (com o cliente admin, que ignora RLS) para
  // garantir que nome/telefone/perfil fiquem corretos, sem inserir uma linha duplicada.
  const { error: updateError } = await admin
    .from("profiles")
    .update({ nome, telefone: telefone || null, perfil })
    .eq("id", invited.user.id);

  if (updateError) {
    return NextResponse.json(
      {
        warning: "Convite enviado, mas não foi possível atualizar os dados do perfil.",
        user: { id: invited.user.id, email: invited.user.email },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { user: { id: invited.user.id, email: invited.user.email, nome, telefone, perfil } },
    { status: 200 }
  );
}
