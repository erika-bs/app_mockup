import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';

const perguntas = [
  {
    pergunta: 'Como eu busco uma música?',
    resposta: 'Na aba Buscar, digite o nome da música, do artista ou do álbum. A busca começa sozinha quando você para de digitar.',
  },
  {
    pergunta: 'Como salvo uma música?',
    resposta: 'Abra a música e toque no coração. Ela vai para a aba Favoritos, na Sua Biblioteca.',
  },
  {
    pergunta: 'Por que a música toca só 30 segundos?',
    resposta: 'A API fornece apenas uma prévia de 30 segundos de cada faixa. Quando ela termina, o player passa para a próxima da fila.',
  },
  {
    pergunta: 'Onde vejo o que eu já ouvi?',
    resposta: 'Em Sua Biblioteca, na aba Playlists, toque em Histórico de Reprodução. Você pode ordenar por mais recentes ou por artista.',
  },
  {
    pergunta: 'Onde ficam os meus dados?',
    resposta: 'Tudo fica no seu aparelho: a senha em armazenamento seguro, o histórico em um banco local e as músicas salvas e o cache de buscas em armazenamento simples.',
  },
  {
    pergunta: 'Esqueci minha senha. E agora?',
    resposta: 'Como a conta fica só neste aparelho, não há recuperação. Na tela de Login, toque em Criar conta e cadastre uma nova, que substitui a anterior.',
  },
];

export default function Ajuda() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>
        <Text style={styles.titulo}>Ajuda</Text>

        {perguntas.map((p) => (
          <View key={p.pergunta} style={styles.bloco}>
            <Text style={styles.pergunta}>{p.pergunta}</Text>
            <Text style={styles.resposta}>{p.resposta}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', marginTop: 12, marginBottom: 20 },
  bloco: { backgroundColor: cores.card, borderRadius: 8, padding: 14, marginBottom: 12 },
  pergunta: { color: cores.texto, fontSize: 16, fontWeight: '700' },
  resposta: { color: cores.textoSecundario, fontSize: 14, marginTop: 6, lineHeight: 20 },
});