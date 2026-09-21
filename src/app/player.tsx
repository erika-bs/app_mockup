import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { musicas } from '@/data/musicas';

const paraSegundos = (d: string) => {
  const [min, seg] = d.split(':').map(Number);
  return min * 60 + seg;
};

const formatar = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Player() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const indice = Math.max(0, musicas.findIndex((m) => m.id === id));
  const musica = musicas[indice];

  const [tocando, setTocando] = useState(true);
  const [curtida, setCurtida] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const total = paraSegundos(musica.duracao);

  useEffect(() => {
    setSegundos(0);
  }, [musica.id]);

  useEffect(() => {
    if (!tocando) return;
    const timer = setInterval(() => setSegundos((s) => (s < total ? s + 1 : s)), 1000);
    return () => clearInterval(timer);
  }, [tocando, total]);

  const irPara = (novo: number) => {
    const alvo = (novo + musicas.length) % musicas.length;
    router.setParams({ id: musicas[alvo].id });
  };

  const pct = Math.round((segundos / total) * 100);

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.topo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={30} color={cores.texto} />
        </Pressable>
        <Text style={styles.topoTexto} numberOfLines={1}>{musica.album}</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color={cores.texto} />
      </View>

      <Image source={musica.capa} style={styles.capa} />

      <View style={styles.info}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo} numberOfLines={1}>{musica.titulo}</Text>
          <Text style={styles.artista}>{musica.artista}</Text>
        </View>
        <Pressable onPress={() => setCurtida(!curtida)}>
          <Ionicons
            name={curtida ? 'heart' : 'heart-outline'}
            size={28}
            color={curtida ? cores.verde : cores.texto}
          />
        </Pressable>
      </View>

      <View style={styles.trilha}>
        <View style={[styles.progresso, { width: `${pct}%` as const }]} />
      </View>
      <View style={styles.tempos}>
        <Text style={styles.tempo}>{formatar(segundos)}</Text>
        <Text style={styles.tempo}>{musica.duracao}</Text>
      </View>

      <View style={styles.controles}>
        <Ionicons name="shuffle" size={26} color={cores.textoSecundario} />
        <Pressable onPress={() => irPara(indice - 1)}>
          <Ionicons name="play-skip-back" size={34} color={cores.texto} />
        </Pressable>
        <Pressable style={styles.play} onPress={() => setTocando(!tocando)}>
          <Ionicons name={tocando ? 'pause' : 'play'} size={34} color="#000" />
        </Pressable>
        <Pressable onPress={() => irPara(indice + 1)}>
          <Ionicons name="play-skip-forward" size={34} color={cores.texto} />
        </Pressable>
        <Ionicons name="repeat" size={26} color={cores.textoSecundario} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#2A1B3D', paddingHorizontal: 24 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  topoTexto: { flex: 1, color: cores.texto, fontSize: 13, fontWeight: '600', textAlign: 'center', marginHorizontal: 12 },
  capa: { width: '100%', aspectRatio: 1, borderRadius: 8, marginTop: 32 },
  info: { flexDirection: 'row', alignItems: 'center', marginTop: 32 },
  titulo: { color: cores.texto, fontSize: 24, fontWeight: '800' },
  artista: { color: cores.textoSecundario, fontSize: 16, marginTop: 4 },
  trilha: { height: 4, backgroundColor: '#5A4A6A', borderRadius: 2, marginTop: 24 },
  progresso: { height: 4, backgroundColor: cores.texto, borderRadius: 2 },
  tempos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  tempo: { color: cores.textoSecundario, fontSize: 12 },
  controles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  play: { width: 68, height: 68, borderRadius: 34, backgroundColor: cores.texto, alignItems: 'center', justifyContent: 'center' },
});