import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { limparHistorico, listarHistorico, RegistroHistorico } from '@/storage/historico';

type Ordem = 'recente' | 'artista';

export default function HistoricoScreen() {
  const router = useRouter();
  const [ordem, setOrdem] = useState<Ordem>('recente');
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [ordem])
  );

  async function carregar() {
    setCarregando(true);
    const lista = await listarHistorico(ordem);
    setHistorico(lista);
    setCarregando(false);
  }

  async function limpar() {
    await limparHistorico();
    setHistorico([]);
  }

  function formatarData(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>
        <Text style={styles.titulo}>Histórico</Text>
        <Pressable onPress={limpar}>
          <Ionicons name="trash-outline" size={22} color={cores.textoSecundario} />
        </Pressable>
      </View>

      <View style={styles.filtros}>
        <Pressable style={[styles.chip, ordem === 'recente' && styles.chipAtivo]} onPress={() => setOrdem('recente')}>
          <Text style={[styles.chipTexto, ordem === 'recente' && styles.chipTextoAtivo]}>Mais recentes</Text>
        </Pressable>
        <Pressable style={[styles.chip, ordem === 'artista' && styles.chipAtivo]} onPress={() => setOrdem('artista')}>
          <Text style={[styles.chipTexto, ordem === 'artista' && styles.chipTextoAtivo]}>Por artista</Text>
        </Pressable>
      </View>

      {!carregando && historico.length === 0 && (
        <View style={styles.vazio}>
          <Ionicons name="time-outline" size={40} color={cores.textoSecundario} />
          <Text style={styles.vazioTexto}>Nenhuma música tocada ainda.</Text>
        </View>
      )}

      <FlatList
        data={historico}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable style={styles.linha} onPress={() => router.push(`/resultado/${item.trackId}`)}>
            <Image source={{ uri: item.artworkUrl100 }} style={styles.capa} />
            <View style={styles.textos}>
              <Text style={styles.nome} numberOfLines={1}>{item.trackName}</Text>
              <Text style={styles.sub} numberOfLines={1}>{item.artistName}</Text>
            </View>
            <Text style={styles.data}>{formatarData(item.tocadoEm)}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  titulo: { color: cores.texto, fontSize: 20, fontWeight: '800' },
  filtros: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  chip: { backgroundColor: cores.card, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipAtivo: { backgroundColor: cores.verde },
  chipTexto: { color: cores.texto, fontSize: 13 },
  chipTextoAtivo: { color: '#000', fontWeight: '700' },
  vazio: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 },
  vazioTexto: { color: cores.textoSecundario },
  lista: { paddingHorizontal: 16, paddingBottom: 40 },
  linha: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  capa: { width: 48, height: 48, borderRadius: 4, backgroundColor: cores.card },
  textos: { flex: 1, marginLeft: 12 },
  nome: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  sub: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
  data: { color: cores.textoSecundario, fontSize: 11 },
});