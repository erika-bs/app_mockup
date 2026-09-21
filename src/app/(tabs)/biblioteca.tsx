import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { playlists } from '@/data/playlists';
import { artistas } from '@/data/artistas';

const filtros = ['Playlists', 'Artistas'] as const;

export default function Biblioteca() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>('Playlists');

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

        {filtro === 'Playlists'
          ? playlists.map((p) => (
              <Pressable key={p.id} style={styles.linha} onPress={() => router.push(`/playlist/${p.id}`)}>
                <Image source={p.capa} style={styles.capa} />
                <View style={styles.textos}>
                  <Text style={styles.nome}>{p.nome}</Text>
                  <Text style={styles.sub}>Playlist • {p.faixas.length} músicas</Text>
                </View>
              </Pressable>
            ))
          : artistas.map((a) => (
              <Pressable key={a.id} style={styles.linha} onPress={() => router.push(`/artista/${a.id}`)}>
                <Image source={a.foto} style={[styles.capa, styles.redonda]} />
                <View style={styles.textos}>
                  <Text style={styles.nome}>{a.nome}</Text>
                  <Text style={styles.sub}>Artista</Text>
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
  redonda: { borderRadius: 32 },
  textos: { marginLeft: 12 },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '600' },
  sub: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
});