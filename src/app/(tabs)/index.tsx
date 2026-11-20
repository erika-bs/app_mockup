import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { colecoes } from '@/constants/colecoes';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { ResultadoBusca } from '@/types/api';

const saudacao = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Bom dia';
  if (hora >= 12 && hora < 18) return 'Boa tarde';
  return 'Boa noite';
};

type ColecaoComCapa = { id: string; titulo: string; termoBusca: string; capa: string | null };

export default function Home() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [colecoesComCapa, setColecoesComCapa] = useState<ColecaoComCapa[]>([]);
  const [recentes, setRecentes] = useState<ResultadoBusca[]>([]);

  useEffect(() => {
    carregarHome();
  }, []);

  async function carregarHome() {
    setCarregando(true);

    const resultadosColecoes = await Promise.allSettled(
      colecoes.map((c) =>
        comCache(`colecao:${c.id}`, () => api.buscarMusicas(c.termoBusca), 30 * 60_000)
      )
    );

    const comCapa: ColecaoComCapa[] = colecoes.map((c, i) => {
      const resultado = resultadosColecoes[i];
      const primeiro = resultado.status === 'fulfilled' ? resultado.value.dados.results[0] : undefined;
      return { ...c, capa: primeiro?.artworkUrl100 ?? null };
    });
    setColecoesComCapa(comCapa);

    try {
      const { dados } = await comCache('recentes:top-hits', () => api.buscarMusicas('top hits 2026'), 30 * 60_000);
      setRecentes(dados.results.slice(0, 12));
    } catch (e) {
      setRecentes([]);
    }

    setCarregando(false);
  }

  function abrirColecao(termoBusca: string) {
    router.push({ pathname: '/buscar', params: { termo: termoBusca } });
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.topo}>
          <Text style={styles.saudacao}>{saudacao()}</Text>
          <Pressable onPress={() => router.push('/perfil')}>
            <Ionicons name="person-circle-outline" size={32} color={cores.texto} />
          </Pressable>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color={cores.verde} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.grade}>
              {colecoesComCapa.map((c) => (
                <Pressable key={c.id} style={styles.atalho} onPress={() => abrirColecao(c.termoBusca)}>
                  {c.capa ? (
                    <Image source={{ uri: c.capa }} style={styles.atalhoCapa} />
                  ) : (
                    <View style={[styles.atalhoCapa, { backgroundColor: cores.card }]} />
                  )}
                  <Text style={styles.atalhoTexto} numberOfLines={2}>{c.titulo}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.secao}>Feito para você</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {colecoesComCapa.map((c) => (
                <Pressable key={c.id} style={styles.cardColecao} onPress={() => abrirColecao(c.termoBusca)}>
                  {c.capa ? (
                    <Image source={{ uri: c.capa }} style={styles.cardColecaoCapa} />
                  ) : (
                    <View style={[styles.cardColecaoCapa, { backgroundColor: cores.card }]} />
                  )}
                  <Text style={styles.cardColecaoTitulo} numberOfLines={1}>{c.titulo}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.secao}>Novidades</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentes.map((m) => (
                <Pressable
                  key={m.trackId}
                  style={styles.cardColecao}
                  onPress={() => router.push(`/resultado/${m.trackId}`)}
                >
                  <Image source={{ uri: m.artworkUrl100 }} style={styles.cardColecaoCapa} />
                  <Text style={styles.cardColecaoTitulo} numberOfLines={1}>{m.trackName}</Text>
                  <Text style={styles.cardColecaoSub} numberOfLines={1}>{m.artistName}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
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
  cardColecao: { width: 140, marginRight: 14 },
  cardColecaoCapa: { width: 140, height: 140, borderRadius: 6, backgroundColor: cores.card },
  cardColecaoTitulo: { color: cores.texto, fontWeight: '700', fontSize: 13, marginTop: 6 },
  cardColecaoSub: { color: cores.textoSecundario, fontSize: 12, marginTop: 2 },
});