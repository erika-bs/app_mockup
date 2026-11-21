import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { credenciais } from '@/storage/credenciais';

const CHAVE_NOME = 'conta_nome';
const CHAVE_EMAIL = 'conta_email';
const CHAVE_SENHA = 'conta_senha';
const CHAVE_SESSAO = 'sessao_ativa';

export type Usuario = { nome: string; email: string };

type AuthValor = {
  usuario: Usuario | null;
  carregando: boolean;
  temConta: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => Promise<void>;
  apagarConta: () => Promise<void>;
  atualizarNome: (nome: string) => Promise<void>;
};

const AuthContext = createContext<AuthValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [temConta, setTemConta] = useState(false);

  useEffect(() => {
    restaurar();
  }, []);

  async function restaurar() {
    try {
      const email = await credenciais.ler(CHAVE_EMAIL);
      const nome = await credenciais.ler(CHAVE_NOME);
      const sessao = await credenciais.ler(CHAVE_SESSAO);
      setTemConta(!!email);
      if (email && sessao === '1') {
        setUsuario({ nome: nome ?? 'Usuário', email });
      }
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    const emailLimpo = email.trim().toLowerCase();
    const nomeLimpo = nome.trim();
    await credenciais.salvar(CHAVE_NOME, nomeLimpo);
    await credenciais.salvar(CHAVE_EMAIL, emailLimpo);
    await credenciais.salvar(CHAVE_SENHA, senha);
    await credenciais.salvar(CHAVE_SESSAO, '1');
    setTemConta(true);
    setUsuario({ nome: nomeLimpo, email: emailLimpo });
  }

  async function entrar(email: string, senha: string) {
    const emailSalvo = await credenciais.ler(CHAVE_EMAIL);
    const senhaSalva = await credenciais.ler(CHAVE_SENHA);
    if (email.trim().toLowerCase() !== emailSalvo || senha !== senhaSalva) {
      return false;
    }
    const nome = await credenciais.ler(CHAVE_NOME);
    await credenciais.salvar(CHAVE_SESSAO, '1');
    setUsuario({ nome: nome ?? 'Usuário', email: emailSalvo });
    return true;
  }

  async function sair() {
    await credenciais.remover(CHAVE_SESSAO);
    setUsuario(null);
  }

  async function apagarConta() {
    await credenciais.remover(CHAVE_SESSAO);
    await credenciais.remover(CHAVE_NOME);
    await credenciais.remover(CHAVE_EMAIL);
    await credenciais.remover(CHAVE_SENHA);
    setUsuario(null);
    setTemConta(false);
  }

  async function atualizarNome(nome: string) {
    const nomeLimpo = nome.trim();
    await credenciais.salvar(CHAVE_NOME, nomeLimpo);
    setUsuario((atual) => (atual ? { ...atual, nome: nomeLimpo } : atual));
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, temConta, cadastrar, entrar, sair, apagarConta, atualizarNome }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return ctx;
}