import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { credenciais } from '@/storage/credenciais';
import { cores } from '@/constants/cores';

const CHAVE_EMAIL = 'conta_email';
const CHAVE_SENHA = 'conta_senha';

type Modo = 'carregando' | 'cadastro' | 'login';

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>('carregando');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    verificarContaExistente();
  }, []);

  async function verificarContaExistente() {
    const emailSalvo = await credenciais.ler(CHAVE_EMAIL);
    setModo(emailSalvo ? 'login' : 'cadastro');
  }

  function emailValido(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  async function cadastrar() {
    setErro('');

    if (!emailValido(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 4) {
      setErro('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setEnviando(true);
    await credenciais.salvar(CHAVE_EMAIL, email.trim().toLowerCase());
    await credenciais.salvar(CHAVE_SENHA, senha);
    setEnviando(false);
    router.replace('/(tabs)');
  }

  async function entrar() {
    setErro('');
    setEnviando(true);

    const emailSalvo = await credenciais.ler(CHAVE_EMAIL);
    const senhaSalva = await credenciais.ler(CHAVE_SENHA);

    if (email.trim().toLowerCase() === emailSalvo && senha === senhaSalva) {
      setEnviando(false);
      router.replace('/(tabs)');
    } else {
      setEnviando(false);
      setErro('E-mail ou senha incorretos.');
    }
  }

  async function esqueciSenha() {
    await credenciais.remover(CHAVE_EMAIL);
    await credenciais.remover(CHAVE_SENHA);
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setErro('');
    setModo('cadastro');
  }

  if (modo === 'carregando') {
    return (
      <SafeAreaView style={[styles.tela, styles.centro]}>
        <ActivityIndicator size="large" color={cores.verde} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.conteudo}>
        <View style={styles.logo}>
          <Ionicons name="musical-notes" size={64} color={cores.verde} />
          <Text style={styles.titulo}>
            {modo === 'cadastro' ? 'Crie sua conta' : 'Entrar na sua conta'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.campo}>
            <Ionicons name="mail-outline" size={18} color={cores.textoSecundario} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={cores.textoSecundario}
              value={email}
              onChangeText={(v) => { setEmail(v); setErro(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.campo}>
            <Ionicons name="lock-closed-outline" size={18} color={cores.textoSecundario} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={cores.textoSecundario}
              value={senha}
              onChangeText={(v) => { setSenha(v); setErro(''); }}
              secureTextEntry
            />
          </View>

          {modo === 'cadastro' && (
            <View style={styles.campo}>
              <Ionicons name="lock-closed-outline" size={18} color={cores.textoSecundario} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor={cores.textoSecundario}
                value={confirmarSenha}
                onChangeText={(v) => { setConfirmarSenha(v); setErro(''); }}
                secureTextEntry
              />
            </View>
          )}

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Pressable
            style={styles.primario}
            onPress={modo === 'cadastro' ? cadastrar : entrar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primarioTexto}>{modo === 'cadastro' ? 'Criar conta' : 'Entrar'}</Text>
            )}
          </Pressable>

          {modo === 'login' && (
            <Pressable onPress={esqueciSenha} style={{ marginTop: 16 }}>
              <Text style={styles.link}>Esqueci minha senha / criar outra conta</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centro: { alignItems: 'center', justifyContent: 'center' },
  conteudo: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', padding: 24, justifyContent: 'center' },
  logo: { alignItems: 'center', marginBottom: 40 },
  titulo: { color: cores.texto, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  form: { width: '100%' },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
    gap: 10,
  },
  input: { flex: 1, color: cores.texto, fontSize: 15 },
  erro: { color: '#E8514B', marginBottom: 12, textAlign: 'center' },
  primario: { backgroundColor: cores.verde, borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primarioTexto: { color: '#000', fontWeight: '800', fontSize: 16 },
  link: { color: cores.textoSecundario, textAlign: 'center', fontSize: 13, textDecorationLine: 'underline' },
});