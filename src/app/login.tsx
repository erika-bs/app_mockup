import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { cores } from '@/constants/cores';

export default function Login() {
  const router = useRouter();
  const { entrar, temConta } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar() {
    setErro('');
    if (email.trim() === '' || senha === '') {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    if (!temConta) {
      setErro('Nenhuma conta encontrada. Crie uma conta para entrar.');
      return;
    }
    setEnviando(true);
    try {
      const ok = await entrar(email, senha);
      if (!ok) setErro('E-mail ou senha incorretos.');
    } catch (e) {
      setErro('Não foi possível entrar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Ionicons name="musical-notes" size={56} color={cores.verde} style={styles.logo} />
        <Text style={styles.titulo}>Entrar</Text>
        <Text style={styles.subtitulo}>Entre com o e-mail e a senha da sua conta.</Text>

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

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.botao} onPress={aoEntrar} disabled={enviando}>
          {enviando ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('/cadastro')}>
          <Text style={styles.link}>
            Não tem conta? <Text style={styles.linkDestaque}>Criar conta</Text>
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