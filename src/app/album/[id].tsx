import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { ResultadoBusca } from '@/types/api';

export default function AlbumScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const collectionId = Number(id);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [nomeAlbum, setNomeAlbum] = useState('');
  const [nomeArtista, setNomeArtista] = useState('');
  const [capa, setCapa] = useState<string | null>(null);
  const [faixas, setFaixas] = useState<ResultadoBusca[]>([]);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    setCarregando(true);
    setErro(false);
    try {
      const { dados } = await comCache(
        `album-faixas:${collectionId}`,
        () => api.buscarFaixasDoAlbum(collectionId),
        30 * 60_000
      );
      const faixasReais = dados.results.filter((r: any) => r.trackId);

      setFaixas(faixasReais);
      setNomeAlbum(faixasReais[0]?.collectionName ?? '');
      setNomeArtista(faixasReais[0]?.artistName ?? '');
      setCapa(faixasReais[0]?.artworkUrl100 ?? null);
    } catch (e) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.tela, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.verde} />
      </SafeAreaView>
    );
  }

  if (erro || faixas.length === 0) {
    return (
      <SafeAreaView style={styles.tela}>
        <Text style={styles.erro}>Álbum não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        {capa ? (
          <Image source={{ uri: capa.replace('100x100', '400x400') }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, { backgroundColor: cores.card }]} />
        )}
        <Text style={styles.nome}>{nomeAlbum}</Text>
        <Text style={styles.artista}>{nomeArtista}</Text>
        <Text style={styles.sub}>
          Álbum • {faixas.length} {faixas.length === 1 ? 'faixa' : 'faixas'}
        </Text>

        <View style={styles.lista}>
          {faixas.map((m) => (
            <Pressable
              key={m.trackId}
              style={styles.linhaFaixa}
              onPress={() => router.push(`/resultado/${m.trackId}`)}
            >
              <Image source={{ uri: m.artworkUrl100 }} style={styles.faixaCapa} />
              <View style={styles.faixaTextos}>
                <Text style={styles.faixaNome} numberOfLines={1}>{m.trackName}</Text>
                <Text style={styles.faixaArtista} numberOfLines={1}>{m.artistName}</Text>
              </View>
            </Pressable>
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
  linhaFaixa: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  faixaCapa: { width: 48, height: 48, borderRadius: 4, backgroundColor: cores.card },
  faixaTextos: { flex: 1 },
  faixaNome: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  faixaArtista: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
});