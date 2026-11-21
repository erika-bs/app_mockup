import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { cores } from '@/constants/cores';
import { colecoes } from '@/constants/colecoes';
import { generosParaArtistas } from '@/constants/generosArtistas';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { listarDescobertas } from '@/storage/descobertas';
import { ResultadoBusca } from '@/types/api';

const filtros = ['Playlists', 'Artistas', 'Descobertas'] as const;

type ArtistaReal = { artistId: number; nome: string; foto: string | null };

export default function Biblioteca() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>('Playlists');
  const [descobertas, setDescobertas] = useState<ResultadoBusca[]>([]);
  const [carregandoDescobertas, setCarregandoDescobertas] = useState(true);
  const [artistasReais, setArtistasReais] = useState<ArtistaReal[]>([]);
  const [carregandoArtistas, setCarregandoArtistas] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarDescobertas();
    }, [])
  );

  useEffect(() => {
    carregarArtistas();
  }, []);

  async function carregarDescobertas() {
    setCarregandoDescobertas(true);
    const lista = await listarDescobertas();
    setDescobertas(lista);
    setCarregandoDescobertas(false);
  }

  async function carregarArtistas() {
    setCarregandoArtistas(true);
    const resultados = await Promise.allSettled(
      generosParaArtistas.map((genero) =>
        comCache(`genero-artistas:${genero}`, () => api.buscarMusicas(genero), 60 * 60_000)
      )
    );

    const todasFaixas = resultados.flatMap((r) =>
      r.status === 'fulfilled' ? r.value.dados.results : []
    );

    const artistasUnicos = new Map<number, ArtistaReal>();
    todasFaixas.forEach((m) => {
      if (!artistasUnicos.has(m.artistId)) {
        artistasUnicos.set(m.artistId, {
          artistId: m.artistId,
          nome: m.artistName,
          foto: m.artworkUrl100,
        });
      }
    });

    const lista = Array.from(artistasUnicos.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    setArtistasReais(lista);
    setCarregandoArtistas(false);
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Sua Biblioteca</Text>

        <View style={styles.filtros}>
          {filtros.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={[styles.chip, filtro === f && styles.chipAtivo]}
            >
              <Text style={[styles.chipTexto, filtro === f && styles.chipTextoAtivo]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {filtro === 'Playlists' && (
          <Pressable style={styles.linha} onPress={() => router.push('/historico')}>
            <View style={[styles.capa, styles.curtidas]}>
              <Ionicons name="time" size={28} color={cores.texto} />
            </View>
            <View style={styles.textos}>
              <Text style={styles.nome}>Histórico de Reprodução</Text>
              <Text style={styles.sub}>Músicas que você já tocou</Text>
            </View>
          </Pressable>
        )}

        {filtro === 'Playlists' &&
          colecoes.map((c) => (
            <Pressable key={c.id} style={styles.linha} onPress={() => router.push(`/playlist/${c.id}`)}>
              <View style={[styles.capa, { backgroundColor: cores.card, alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="musical-notes" size={24} color={cores.textoSecundario} />
              </View>
              <View style={styles.textos}>
                <Text style={styles.nome}>{c.titulo}</Text>
                <Text style={styles.sub}>Playlist • API ({c.termoBusca})</Text>
              </View>
            </Pressable>
          ))}

        {filtro === 'Artistas' && carregandoArtistas && (
          <Text style={styles.sub}>Carregando artistas...</Text>
        )}

        {filtro === 'Artistas' &&
          !carregandoArtistas &&
          artistasReais.map((a) => (
            <Pressable
              key={a.artistId}
              style={styles.linha}
              onPress={() => router.push(`/artista/${a.artistId}`)}
            >
              {a.foto ? (
                <Image source={{ uri: a.foto }} style={[styles.capa, styles.redonda]} />
              ) : (
                <View style={[styles.capa, styles.redonda, { backgroundColor: cores.card }]} />
              )}
              <View style={styles.textos}>
                <Text style={styles.nome}>{a.nome}</Text>
                <Text style={styles.sub}>Artista</Text>
              </View>
            </Pressable>
          ))}

        {filtro === 'Descobertas' && !carregandoDescobertas && descobertas.length === 0 && (
          <View style={styles.vazio}>
            <Ionicons name="compass-outline" size={40} color={cores.textoSecundario} />
            <Text style={styles.vazioTexto}>
              Nada salvo ainda. Busque músicas na aba Buscar e toque no coração pra salvar aqui.
            </Text>
          </View>
        )}

        {filtro === 'Descobertas' &&
          descobertas.map((item) => (
            <Pressable
              key={item.trackId}
              style={styles.linha}
              onPress={() => router.push(`/resultado/${item.trackId}`)}
            >
              <Image source={{ uri: item.artworkUrl100 }} style={styles.capa} />
              <View style={styles.textos}>
                <Text style={styles.nome}>{item.trackName}</Text>
                <Text style={styles.sub}>{item.artistName}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 150 },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', marginBottom: 16 },
  filtros: { flexDirection: 'row', marginBottom: 16 },
  chip: { backgroundColor: cores.card, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  chipAtivo: { backgroundColor: cores.verde },
  chipTexto: { color: cores.texto },
  chipTextoAtivo: { color: '#000', fontWeight: '700' },
  linha: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  capa: { width: 64, height: 64, borderRadius: 4, backgroundColor: cores.card },
  curtidas: { backgroundColor: '#4A2FBD', alignItems: 'center', justifyContent: 'center' },
  redonda: { borderRadius: 32 },
  textos: { marginLeft: 12 },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '600' },
  sub: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
  vazio: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, paddingHorizontal: 24, gap: 10 },
  vazioTexto: { color: cores.textoSecundario, fontSize: 14, textAlign: 'center' },
});