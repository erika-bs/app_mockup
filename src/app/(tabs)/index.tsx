import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { playlists } from '@/data/playlists';
import { musicas } from '@/data/musicas';
import CardMusica from '@/components/CardMusica';

const saudacao = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Bom dia';
  if (hora >= 12 && hora < 18) return 'Boa tarde';
  return 'Boa noite';
};

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.topo}>
          <Text style={styles.saudacao}>{saudacao()}</Text>
          <Pressable onPress={() => router.push('/perfil')}>
            <Ionicons name="person-circle-outline" size={32} color={cores.texto} />
          </Pressable>
        </View>

        <View style={styles.grade}>
          {playlists.map((p) => (
            <Pressable
              key={p.id}
              style={styles.atalho}
              onPress={() => router.push(`/playlist/${p.id}`)}
            >
              <Image source={p.capa} style={styles.atalhoCapa} />
              <Text style={styles.atalhoTexto} numberOfLines={2}>{p.nome}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.secao}>Feito para você</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {playlists.map((p) => (
            <CardMusica
              key={p.id}
              titulo={p.nome}
              subtitulo={p.descricao}
              capa={p.capa}
              onPress={() => router.push(`/playlist/${p.id}`)}
            />
          ))}
        </ScrollView>

        <Text style={styles.secao}>Tocadas recentemente</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {musicas.map((m) => (
            <CardMusica
              key={m.id}
              titulo={m.titulo}
              subtitulo={m.artista}
              capa={m.capa}
              onPress={() => router.push({ pathname: '/player', params: { id: m.id } })}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 150 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  saudacao: { color: cores.texto, fontSize: 24, fontWeight: '800' },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  atalho: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  atalhoCapa: { width: 52, height: 52 },
  atalhoTexto: { flex: 1, color: cores.texto, fontWeight: '700', fontSize: 13, marginHorizontal: 8 },
  secao: { color: cores.texto, fontSize: 20, fontWeight: '800', marginTop: 20, marginBottom: 12 },
});