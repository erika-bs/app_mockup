import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { ResultadoBusca } from '@/types/api';

type AlbumResumido = { collectionId: number; collectionName: string; artworkUrl100: string };

export default function ArtistaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const artistId = Number(id);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [nomeArtista, setNomeArtista] = useState('');
  const [genero, setGenero] = useState('');
  const [banner, setBanner] = useState<string | null>(null);
  const [faixas, setFaixas] = useState<ResultadoBusca[]>([]);
  const [albuns, setAlbuns] = useState<AlbumResumido[]>([]);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    setCarregando(true);
    setErro(false);
    try {
      const [respFaixas, respAlbuns] = await Promise.all([
        comCache(`artista-faixas:${artistId}`, () => api.buscarFaixasDoArtista(artistId), 30 * 60_000),
        comCache(`artista-albuns:${artistId}`, () => api.buscarDiscografia(artistId), 30 * 60_000),
      ]);

      const faixasReais = respFaixas.dados.results.filter((r: any) => r.trackId);
      const albunsReais = respAlbuns.dados.results.filter((r: any) => r.collectionId) as unknown as AlbumResumido[];
      const albunsSemRepetir = albunsReais.filter(
        (a, i, lista) => lista.findIndex((x) => x.collectionId === a.collectionId) === i
      );

      setFaixas(faixasReais);
      setAlbuns(albunsSemRepetir);
      setNomeArtista(faixasReais[0]?.artistName ?? '');
      setGenero(faixasReais[0]?.primaryGenreName ?? '');
      setBanner(faixasReais[0]?.artworkUrl100 ?? null);
    } catch (e) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <View style={[styles.tela, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.verde} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={[styles.tela, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
        <Text style={styles.erro}>Não foi possível carregar esse artista.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: cores.verde, marginTop: 12 }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View>
          {banner ? (
            <Image source={{ uri: banner.replace('100x100', '400x400') }} style={styles.banner} />
          ) : (
            <View style={[styles.banner, { backgroundColor: cores.card }]} />
          )}
          <Pressable onPress={() => router.back()} style={styles.voltar}>
            <Ionicons name="chevron-back" size={28} color={cores.texto} />
          </Pressable>
          <Text style={styles.nome}>{nomeArtista}</Text>
        </View>

        <View style={styles.corpo}>
          <Text style={styles.genero}>{genero}</Text>

          <Text style={styles.secao}>Populares</Text>
          {faixas.slice(0, 10).map((m) => (
            <Pressable
              key={m.trackId}
              style={styles.linhaFaixa}
              onPress={() => router.push(`/resultado/${m.trackId}`)}
            >
              <Image source={{ uri: m.artworkUrl100 }} style={styles.faixaCapa} />
              <View style={styles.faixaTextos}>
                <Text style={styles.faixaNome} numberOfLines={1}>{m.trackName}</Text>
                <Text style={styles.faixaArtista} numberOfLines={1}>{m.collectionName}</Text>
              </View>
            </Pressable>
          ))}

          <Text style={[styles.secao, { marginTop: 24 }]}>Álbuns</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albuns.map((a) => (
              <Pressable
                key={a.collectionId}
                style={styles.cardAlbum}
                onPress={() => router.push(`/album/${a.collectionId}`)}
              >
                <Image source={{ uri: a.artworkUrl100 }} style={styles.cardAlbumCapa} />
                <Text style={styles.cardAlbumTitulo} numberOfLines={1}>{a.collectionName}</Text>
              </Pressable>
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
  erro: { color: cores.texto, textAlign: 'center' },
  linhaFaixa: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  faixaCapa: { width: 48, height: 48, borderRadius: 4, backgroundColor: cores.card },
  faixaTextos: { flex: 1 },
  faixaNome: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  faixaArtista: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
  cardAlbum: { width: 140, marginRight: 14 },
  cardAlbumCapa: { width: 140, height: 140, borderRadius: 6, backgroundColor: cores.card },
  cardAlbumTitulo: { color: cores.texto, fontWeight: '700', fontSize: 13, marginTop: 6 },
});