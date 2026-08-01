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

export type TipoProjeto =
  | "site"
  | "landing_page"
  | "sistema"
  | "trafego_pago"
  | "branding"
  | "social_media"
  | "consultoria"
  | "seo"
  | "automacao";

export type StatusProjeto = "a_fazer" | "em_andamento" | "em_revisao" | "concluido";

export type PrioridadeProjeto = "baixa" | "media" | "alta" | "urgente";

export interface ProjetoChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface ProjetoComentario {
  id: string;
  autor_id: string;
  autor_nome: string;
  texto: string;
  criado_em: string;
}

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

export type TipoCampanha =
  | "google_ads"
  | "meta_ads"
  | "landing_pages"
  | "social_media"
  | "seo"
  | "email_marketing";

export type StatusCampanha = "planejamento" | "ativa" | "pausada" | "concluida";

export interface CampanhaResultados {
  impressoes?: number;
  cliques?: number;
  conversoes?: number;
  leads_gerados?: number;
  observacoes?: string;
}

export type SslStatus = "ativo" | "pendente" | "expirado";

export type StatusSite = "online" | "manutencao" | "offline";

export type StatusSistema = "producao" | "desenvolvimento" | "descontinuado";

export type PrioridadeChamado = "baixa" | "media" | "alta" | "urgente";

export type StatusChamado = "aberto" | "em_andamento" | "resolvido" | "fechado";

export type StatusConta = "em_aberto" | "pago" | "atrasado";

export type FormaPagamento = "pix" | "boleto" | "cartao" | "dinheiro";

export type TipoCategoriaFinanceira = "receita" | "despesa";

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
      projetos: {
        Row: {
          id: string;
          nome: string;
          cliente_id: string | null;
          responsavel_id: string | null;
          equipe: string[];
          tipo: TipoProjeto;
          status: StatusProjeto;
          prioridade: PrioridadeProjeto;
          prazo: string | null;
          progresso: number;
          descricao: string | null;
          checklist: ProjetoChecklistItem[];
          comentarios: ProjetoComentario[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          cliente_id?: string | null;
          responsavel_id?: string | null;
          equipe?: string[];
          tipo: TipoProjeto;
          status?: StatusProjeto;
          prioridade?: PrioridadeProjeto;
          prazo?: string | null;
          progresso?: number;
          descricao?: string | null;
          checklist?: ProjetoChecklistItem[];
          comentarios?: ProjetoComentario[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          cliente_id?: string | null;
          responsavel_id?: string | null;
          equipe?: string[];
          tipo?: TipoProjeto;
          status?: StatusProjeto;
          prioridade?: PrioridadeProjeto;
          prazo?: string | null;
          progresso?: number;
          descricao?: string | null;
          checklist?: ProjetoChecklistItem[];
          comentarios?: ProjetoComentario[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campanhas: {
        Row: {
          id: string;
          cliente_id: string | null;
          nome: string;
          tipo: TipoCampanha;
          objetivo: string | null;
          investimento: number;
          status: StatusCampanha;
          data_inicio: string;
          data_fim: string | null;
          resultados: CampanhaResultados | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id?: string | null;
          nome: string;
          tipo: TipoCampanha;
          objetivo?: string | null;
          investimento?: number;
          status?: StatusCampanha;
          data_inicio: string;
          data_fim?: string | null;
          resultados?: CampanhaResultados | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string | null;
          nome?: string;
          tipo?: TipoCampanha;
          objetivo?: string | null;
          investimento?: number;
          status?: StatusCampanha;
          data_inicio?: string;
          data_fim?: string | null;
          resultados?: CampanhaResultados | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sites: {
        Row: {
          id: string;
          cliente_id: string | null;
          dominio: string;
          hospedagem: string | null;
          ssl: SslStatus;
          status: StatusSite;
          ultima_atualizacao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id?: string | null;
          dominio: string;
          hospedagem?: string | null;
          ssl?: SslStatus;
          status?: StatusSite;
          ultima_atualizacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string | null;
          dominio?: string;
          hospedagem?: string | null;
          ssl?: SslStatus;
          status?: StatusSite;
          ultima_atualizacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sistemas: {
        Row: {
          id: string;
          cliente_id: string | null;
          sistema: string;
          versao: string | null;
          status: StatusSistema;
          documentacao_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id?: string | null;
          sistema: string;
          versao?: string | null;
          status?: StatusSistema;
          documentacao_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string | null;
          sistema?: string;
          versao?: string | null;
          status?: StatusSistema;
          documentacao_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chamados: {
        Row: {
          id: string;
          sistema_id: string;
          titulo: string;
          descricao: string | null;
          prioridade: PrioridadeChamado;
          status: StatusChamado;
          aberto_por: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sistema_id: string;
          titulo: string;
          descricao?: string | null;
          prioridade?: PrioridadeChamado;
          status?: StatusChamado;
          aberto_por?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sistema_id?: string;
          titulo?: string;
          descricao?: string | null;
          prioridade?: PrioridadeChamado;
          status?: StatusChamado;
          aberto_por?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contas_receber: {
        Row: {
          id: string;
          cliente_id: string | null;
          descricao: string;
          valor: number;
          vencimento: string;
          status: StatusConta;
          forma_pagamento: FormaPagamento | null;
          parcelas: number;
          parcela_atual: number;
          data_pagamento: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id?: string | null;
          descricao: string;
          valor: number;
          vencimento: string;
          status?: StatusConta;
          forma_pagamento?: FormaPagamento | null;
          parcelas?: number;
          parcela_atual?: number;
          data_pagamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string | null;
          descricao?: string;
          valor?: number;
          vencimento?: string;
          status?: StatusConta;
          forma_pagamento?: FormaPagamento | null;
          parcelas?: number;
          parcela_atual?: number;
          data_pagamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contas_pagar: {
        Row: {
          id: string;
          fornecedor: string;
          categoria_id: string | null;
          descricao: string;
          valor: number;
          vencimento: string;
          status: StatusConta;
          data_pagamento: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fornecedor: string;
          categoria_id?: string | null;
          descricao: string;
          valor: number;
          vencimento: string;
          status?: StatusConta;
          data_pagamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fornecedor?: string;
          categoria_id?: string | null;
          descricao?: string;
          valor?: number;
          vencimento?: string;
          status?: StatusConta;
          data_pagamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categorias_financeiras: {
        Row: {
          id: string;
          nome: string;
          tipo: TipoCategoriaFinanceira;
        };
        Insert: {
          id?: string;
          nome: string;
          tipo: TipoCategoriaFinanceira;
        };
        Update: {
          id?: string;
          nome?: string;
          tipo?: TipoCategoriaFinanceira;
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
      tipo_projeto: TipoProjeto;
      status_projeto: StatusProjeto;
      prioridade_projeto: PrioridadeProjeto;
      tipo_campanha: TipoCampanha;
      status_campanha: StatusCampanha;
      ssl_status: SslStatus;
      status_site: StatusSite;
      status_sistema: StatusSistema;
      prioridade_chamado: PrioridadeChamado;
      status_chamado: StatusChamado;
      status_conta: StatusConta;
      forma_pagamento: FormaPagamento;
      tipo_categoria_financeira: TipoCategoriaFinanceira;
    };
    CompositeTypes: Record<string, never>;
  };
}
