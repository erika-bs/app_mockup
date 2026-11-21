import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { useAuth } from '@/contexts/AuthContext';

export default function Conta() {
  const router = useRouter();
  const { usuario, atualizarNome } = useAuth();
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function salvar() {
    setMensagem('');
    setErro('');
    if (nome.trim().length < 2) {
      setErro('Digite um nome com pelo menos 2 letras.');
      return;
    }
    try {
      await atualizarNome(nome);
      setMensagem('Nome atualizado.');
    } catch (e) {
      setErro('Não foi possível salvar. Tente de novo.');
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>
        <Text style={styles.titulo}>Conta</Text>

        <Text style={styles.rotulo}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor={cores.textoSecundario}
          autoCapitalize="words"
        />

        <Text style={styles.rotulo}>E-mail</Text>
        <View style={[styles.input, styles.inputDesativado]}>
          <Text style={styles.emailTexto}>{usuario?.email}</Text>
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

        <Pressable style={styles.botao} onPress={salvar}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', marginTop: 12, marginBottom: 24 },
  rotulo: { color: cores.textoSecundario, fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: cores.card,
    color: cores.texto,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    marginBottom: 16,
    justifyContent: 'center',
  },
  inputDesativado: { opacity: 0.6 },
  emailTexto: { color: cores.texto, fontSize: 15 },
  erro: { color: '#E8514B', fontSize: 13, marginBottom: 12 },
  sucesso: { color: cores.verde, fontSize: 13, marginBottom: 12 },
  botao: {
    backgroundColor: cores.verde,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  botaoTexto: { color: '#000', fontWeight: '700', fontSize: 16 },
});