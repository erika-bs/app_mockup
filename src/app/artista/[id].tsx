import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { artistas } from '@/data/artistas';
import { musicas } from '@/data/musicas';
import ItemFaixa from '@/components/ItemFaixa';
import CardMusica from '@/components/CardMusica';

export default function ArtistaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const artista = artistas.find((a) => a.id === id);

  if (!artista) {
    return (
      <SafeAreaView style={styles.tela}>
        <Text style={styles.erro}>Artista não encontrado</Text>
      </SafeAreaView>
    );
  }

  const populares = musicas.filter((m) => m.artistaId === artista.id);
  const albuns = populares.filter(
    (m, i, lista) => lista.findIndex((x) => x.album === m.album) === i
  );

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View>
          <Image source={artista.foto} style={styles.banner} />
          <Pressable onPress={() => router.back()} style={styles.voltar}>
            <Ionicons name="chevron-back" size={28} color={cores.texto} />
          </Pressable>
          <Text style={styles.nome}>{artista.nome}</Text>
        </View>

        <View style={styles.corpo}>
          <Text style={styles.genero}>{artista.genero}</Text>

          <Text style={styles.secao}>Populares</Text>
          {populares.map((m) => (
            <ItemFaixa key={m.id} musica={m} />
          ))}

          <Text style={[styles.secao, { marginTop: 24 }]}>Álbuns</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albuns.map((m) => (
              <CardMusica
                key={m.album}
                titulo={m.album}
                subtitulo="Álbum"
                capa={m.capa}
                onPress={() => router.push(`/album/${m.id}`)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  banner: { width: '100%', height: 280 },
  voltar: { position: 'absolute', top: 48, left: 12 },
  nome: { position: 'absolute', bottom: 16, left: 16, color: cores.texto, fontSize: 36, fontWeight: '900' },
  corpo: { padding: 16 },
  genero: { color: cores.textoSecundario, marginBottom: 16 },
  secao: { color: cores.texto, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  erro: { color: cores.texto, textAlign: 'center', marginTop: 40 },
});