import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { cores } from '@/constants/cores';

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function emailValido(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  async function aoCadastrar() {
    setErro('');
    if (nome.trim().length < 2) {
      setErro('Digite seu nome.');
      return;
    }
    if (!emailValido(email.trim())) {
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
    try {
      await cadastrar(nome, email, senha);
    } catch (e) {
      setErro('Não foi possível criar a conta. Tente de novo.');
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Ionicons name="musical-notes" size={56} color={cores.verde} style={styles.logo} />
        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Preencha seus dados para entrar no app.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor={cores.textoSecundario}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={cores.textoSecundario}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={cores.textoSecundario}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor={cores.textoSecundario}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.botao} onPress={aoCadastrar} disabled={enviando}>
          {enviando ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.botaoTexto}>Criar conta</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>
            Já tem conta? <Text style={styles.linkDestaque}>Entrar</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24, width: '100%', maxWidth: 420, alignSelf: 'center' },
  logo: { alignSelf: 'center', marginBottom: 16 },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitulo: { color: cores.textoSecundario, fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  input: {
    backgroundColor: cores.card,
    color: cores.texto,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    marginBottom: 12,
  },
  erro: { color: '#E8514B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  botao: {
    backgroundColor: cores.verde,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  botaoTexto: { color: '#000', fontWeight: '700', fontSize: 16 },
  link: { color: cores.textoSecundario, textAlign: 'center', marginTop: 20 },
  linkDestaque: { color: cores.verde, fontWeight: '700' },
});