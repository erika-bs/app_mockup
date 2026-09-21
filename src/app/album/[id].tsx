import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { musicas } from '@/data/musicas';
import ItemFaixa from '@/components/ItemFaixa';

export default function AlbumScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const musica = musicas.find((m) => m.id === id);

  if (!musica) {
    return (
      <SafeAreaView style={styles.tela}>
        <Text style={styles.erro}>Álbum não encontrado</Text>
      </SafeAreaView>
    );
  }

  const faixas = musicas.filter((m) => m.album === musica.album);

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        <Image source={musica.capa} style={styles.capa} />
        <Text style={styles.nome}>{musica.album}</Text>
        <Text style={styles.artista}>{musica.artista}</Text>
        <Text style={styles.sub}>
          Álbum • {faixas.length} {faixas.length === 1 ? 'faixa' : 'faixas'}
        </Text>

        <View style={styles.lista}>
          {faixas.map((m) => (
            <ItemFaixa key={m.id} musica={m} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  capa: { width: 220, height: 220, alignSelf: 'center', borderRadius: 6, marginVertical: 16 },
  nome: { color: cores.texto, fontSize: 24, fontWeight: '800' },
  artista: { color: cores.texto, fontSize: 16, marginTop: 4 },
  sub: { color: cores.textoSecundario, marginTop: 4 },
  lista: { marginTop: 16 },
  erro: { color: cores.texto, textAlign: 'center', marginTop: 40 },
});