import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { playlists } from '@/data/playlists';
import { Musica, musicas } from '@/data/musicas';
import ItemFaixa from '@/components/ItemFaixa';

export default function PlaylistScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <SafeAreaView style={styles.tela}>
        <Text style={styles.erro}>Playlist não encontrada</Text>
      </SafeAreaView>
    );
  }

  const faixas = playlist.faixas
    .map((fid) => musicas.find((m) => m.id === fid))
    .filter((m): m is Musica => m !== undefined);

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()} style={styles.voltar}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        <Image source={playlist.capa} style={styles.capa} />
        <Text style={styles.nome}>{playlist.nome}</Text>
        <Text style={styles.descricao}>{playlist.descricao}</Text>

        <View style={styles.acoes}>
          <Ionicons name="heart-outline" size={28} color={cores.textoSecundario} />
          <Pressable
            style={styles.play}
            onPress={() => router.push({ pathname: '/player', params: { id: faixas[0]?.id } })}
          >
            <Ionicons name="play" size={28} color="#000" />
          </Pressable>
        </View>

        {faixas.map((m) => (
          <ItemFaixa key={m.id} musica={m} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  voltar: { marginBottom: 8 },
  capa: { width: 220, height: 220, alignSelf: 'center', borderRadius: 6, marginBottom: 16 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800' },
  descricao: { color: cores.textoSecundario, marginTop: 4 },
  acoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  play: { width: 56, height: 56, borderRadius: 28, backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center' },
  erro: { color: cores.texto, textAlign: 'center', marginTop: 40 },
});