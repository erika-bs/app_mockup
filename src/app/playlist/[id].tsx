import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { colecoes } from '@/constants/colecoes';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { ResultadoBusca } from '@/types/api';

export default function PlaylistScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colecao = colecoes.find((c) => c.id === id);

  const [carregando, setCarregando] = useState(true);
  const [faixas, setFaixas] = useState<ResultadoBusca[]>([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (colecao) carregar();
  }, [id]);

  async function carregar() {
    if (!colecao) return;
    setCarregando(true);
    setErro(false);
    try {
      const { dados } = await comCache(
        `colecao:${colecao.id}`,
        () => api.buscarMusicas(colecao.termoBusca),
        30 * 60_000
      );
      setFaixas(dados.results);
    } catch (e) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  if (!colecao) {
    return (
      <SafeAreaView style={styles.tela}>
        <Text style={styles.erro}>Playlist não encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()} style={styles.voltar}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        {faixas[0] ? (
          <Image source={{ uri: faixas[0].artworkUrl100 }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, { backgroundColor: cores.card }]} />
        )}
        <Text style={styles.nome}>{colecao.titulo}</Text>
        <Text style={styles.descricao}>Playlist gerada a partir da busca "{colecao.termoBusca}" na API</Text>

        <View style={styles.acoes}>
          <Ionicons name="heart-outline" size={28} color={cores.textoSecundario} />
          <Pressable
            style={styles.play}
            disabled={faixas.length === 0}
            onPress={() => faixas[0] && router.push(`/resultado/${faixas[0].trackId}`)}
          >
            <Ionicons name="play" size={28} color="#000" />
          </Pressable>
        </View>

        {carregando && <ActivityIndicator size="large" color={cores.verde} style={{ marginTop: 24 }} />}

        {erro && <Text style={styles.erro}>Não foi possível carregar essa playlist.</Text>}

        {!carregando &&
          !erro &&
          faixas.map((m) => (
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
  linhaFaixa: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  faixaCapa: { width: 48, height: 48, borderRadius: 4, backgroundColor: cores.card },
  faixaTextos: { flex: 1 },
  faixaNome: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  faixaArtista: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
});