// Hand-written types since `supabase gen types typescript` could not be run without
// network access to the project's database in this environment. Regenerate this file
// from the real schema with the Supabase CLI once access is available:
//   supabase gen types typescript --project-id nobvusgyuctdnqutqygc > src/types/database.types.ts

export type PerfilUsuario =
  | "administrador"
  | "gerente"
  | "consultor"
  | "comercial"
  | "financeiro"
  | "marketing"
  | "desenvolvedor";

export type StatusLead =
  | "novo"
  | "contato"
  | "agendada"
  | "realizada"
  | "proposta"
  | "negociacao"
  | "cliente"
  | "perdido";

export type FormatoConsultoria = "online" | "presencial";

export type StatusConsultoria = "agendada" | "realizada" | "cancelada";

export interface EmpresaContato {
  nome: string;
  cargo?: string;
  telefone?: string;
  email?: string;
}

export interface EmpresaRedesSociais {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  site?: string;
}

export interface EmpresaEndereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          email: string;
          telefone: string | null;
          perfil: PerfilUsuario;
          created_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          email: string;
          telefone?: string | null;
          perfil?: PerfilUsuario;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          telefone?: string | null;
          perfil?: PerfilUsuario;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          empresa_nome: string;
          responsavel: string;
          telefone: string | null;
          email: string | null;
          cidade: string | null;
          uf: string | null;
          segmento: string | null;
          origem: string | null;
          observacoes: string | null;
          status: StatusLead;
          consultor_id: string | null;
          historico: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          empresa_nome: string;
          responsavel: string;
          telefone?: string | null;
          email?: string | null;
          cidade?: string | null;
          uf?: string | null;
          segmento?: string | null;
          origem?: string | null;
          observacoes?: string | null;
          status?: StatusLead;
          consultor_id?: string | null;
          historico?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          empresa_nome?: string;
          responsavel?: string;
          telefone?: string | null;
          email?: string | null;
          cidade?: string | null;
          uf?: string | null;
          segmento?: string | null;
          origem?: string | null;
          observacoes?: string | null;
          status?: StatusLead;
          consultor_id?: string | null;
          historico?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      empresas: {
        Row: {
          id: string;
          nome: string;
          razao_social: string | null;
          cnpj: string | null;
          contatos: EmpresaContato[] | null;
          redes_sociais: EmpresaRedesSociais | null;
          endereco: EmpresaEndereco | null;
          segmento: string | null;
          funcionarios: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          razao_social?: string | null;
          cnpj?: string | null;
          contatos?: EmpresaContato[] | null;
          redes_sociais?: EmpresaRedesSociais | null;
          endereco?: EmpresaEndereco | null;
          segmento?: string | null;
          funcionarios?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          razao_social?: string | null;
          cnpj?: string | null;
          contatos?: EmpresaContato[] | null;
          redes_sociais?: EmpresaRedesSociais | null;
          endereco?: EmpresaEndereco | null;
          segmento?: string | null;
          funcionarios?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consultorias: {
        Row: {
          id: string;
          empresa_id: string | null;
          empresa_nome: string;
          consultor_id: string | null;
          data_hora: string;
          formato: FormatoConsultoria;
          status: StatusConsultoria;
          diagnostico: string | null;
          branding: string | null;
          posicionamento: string | null;
          marketing: string | null;
          pontos_fortes: string | null;
          pontos_fracos: string | null;
          oportunidades: string | null;
          ameacas: string | null;
          plano_estrategico: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          empresa_id?: string | null;
          empresa_nome: string;
          consultor_id?: string | null;
          data_hora: string;
          formato?: FormatoConsultoria;
          status?: StatusConsultoria;
          diagnostico?: string | null;
          branding?: string | null;
          posicionamento?: string | null;
          marketing?: string | null;
          pontos_fortes?: string | null;
          pontos_fracos?: string | null;
          oportunidades?: string | null;
          ameacas?: string | null;
          plano_estrategico?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          empresa_id?: string | null;
          empresa_nome?: string;
          consultor_id?: string | null;
          data_hora?: string;
          formato?: FormatoConsultoria;
          status?: StatusConsultoria;
          diagnostico?: string | null;
          branding?: string | null;
          posicionamento?: string | null;
          marketing?: string | null;
          pontos_fortes?: string | null;
          pontos_fracos?: string | null;
          oportunidades?: string | null;
          ameacas?: string | null;
          plano_estrategico?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      perfil_usuario: PerfilUsuario;
      status_lead: StatusLead;
      formato_consultoria: FormatoConsultoria;
      status_consultoria: StatusConsultoria;
    };
    CompositeTypes: Record<string, never>;
  };
}
