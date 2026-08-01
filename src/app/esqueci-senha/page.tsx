import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const dynamic = "force-dynamic";

export default function EsqueciSenhaPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute -left-[5%] -top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(43,82,255,.2),transparent_70%)] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[5%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(79,216,255,.14),transparent_70%)] blur-[60px]" />

      <div className="relative w-full max-w-[400px] rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-9 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur-xl">
        <div className="mb-7 flex items-center justify-center gap-2.5">
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-bg font-display text-sm font-bold text-accent">
            H
          </div>
          <span className="font-display text-[17px] font-bold">Hubtech</span>
        </div>
        <h1 className="mb-1.5 text-center font-display text-[22px] font-bold">
          Recuperar senha
        </h1>
        <p className="mb-7 text-center text-[13.5px] text-slate">
          Informe seu email para receber o link de redefinição
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
