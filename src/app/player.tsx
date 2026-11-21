import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { cores } from '@/constants/cores';
import { api } from '@/services/api';
import { ResultadoBusca } from '@/types/api';
import { salvarDescoberta, removerDescoberta, estaSalva, listarDescobertas } from '@/storage/descobertas';
import { registrarReproducao } from '@/storage/historico';

const formatar = (s: number) => {
  const inteiro = Math.max(0, Math.floor(s));
  return `${Math.floor(inteiro / 60)}:${String(inteiro % 60).padStart(2, '0')}`;
};

export default function Player() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const trackId = Number(id);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const [musica, setMusica] = useState<ResultadoBusca | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [curtida, setCurtida] = useState(false);
  const [fila, setFila] = useState<number[]>([]);
  const [aleatorio, setAleatorio] = useState(false);
  const [repetir, setRepetir] = useState(false);

  const registrouRef = useRef<number | null>(null);

  const tamanhoCapa = Math.min(width - 48, height * 0.42, 420);
  const total = status.duration > 0 ? status.duration : 30;
  const segundos = status.currentTime;
  const tocando = status.playing;

  useEffect(() => {
    if (!trackId) return;
    carregar();
  }, [trackId]);

  useEffect(() => {
    player.loop = repetir;
  }, [repetir, player]);

  useEffect(() => {
    if (status.didJustFinish && !repetir) {
      irPara(1);
    }
  }, [status.didJustFinish]);

  async function carregar() {
    setCarregando(true);
    setErro(false);
    try {
      const dado = await api.buscarPorId(trackId);
      if (!dado) {
        setErro(true);
        return;
      }
      setMusica(dado);

      if (dado.previewUrl) {
        player.replace({ uri: dado.previewUrl });
        player.play();
      } else {
        player.pause();
      }

      setCurtida(await estaSalva(dado.trackId));

      const salvas = await listarDescobertas();
      const idsFila = salvas.map((m) => m.trackId);
      if (!idsFila.includes(dado.trackId)) idsFila.push(dado.trackId);
      setFila(idsFila);

      if (registrouRef.current !== dado.trackId) {
        registrouRef.current = dado.trackId;
        await registrarReproducao({
          trackId: dado.trackId,
          trackName: dado.trackName,
          artistName: dado.artistName,
          artworkUrl100: dado.artworkUrl100,
        });
      }
    } catch (e) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  function alternarPlay() {
    if (tocando) {
      player.pause();
    } else {
      if (status.didJustFinish || segundos >= total) {
        player.seekTo(0);
      }
      player.play();
    }
  }

  async function alternarCurtida() {
    if (!musica) return;
    if (curtida) {
      await removerDescoberta(musica.trackId);
      setCurtida(false);
    } else {
      await salvarDescoberta(musica);
      setCurtida(true);
    }
  }

  function irPara(delta: number) {
    if (!musica || fila.length === 0) return;
    const indiceAtual = fila.indexOf(musica.trackId);
    let proximoIndice: number;

    if (aleatorio) {
      do {
        proximoIndice = Math.floor(Math.random() * fila.length);
      } while (proximoIndice === indiceAtual && fila.length > 1);
    } else {
      const base = indiceAtual === -1 ? 0 : indiceAtual;
      proximoIndice = (base + delta + fila.length) % fila.length;
    }

    router.setParams({ id: String(fila[proximoIndice]) });
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.tela, styles.centro]}>
        <ActivityIndicator size="large" color={cores.verde} />
      </SafeAreaView>
    );
  }

  if (erro || !musica) {
    return (
      <SafeAreaView style={[styles.tela, styles.centro]}>
        <Ionicons name="alert-circle-outline" size={48} color="#E8514B" />
        <Text style={styles.textoErro}>Não foi possível carregar essa música.</Text>
        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const pct = total > 0 ? Math.min(100, Math.round((segundos / total) * 100)) : 0;

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.conteudo}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={30} color={cores.texto} />
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={() => router.push(`/album/${musica.collectionId}`)}>
            <Text style={styles.topoTexto} numberOfLines={1}>{musica.collectionName}</Text>
          </Pressable>
          <Ionicons name="ellipsis-horizontal" size={24} color={cores.texto} />
        </View>

        <Image
          source={{ uri: musica.artworkUrl100.replace('100x100', '600x600') }}
          style={[styles.capa, { width: tamanhoCapa, height: tamanhoCapa }]}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo} numberOfLines={1}>{musica.trackName}</Text>
            <Text style={styles.artista}>{musica.artistName}</Text>
          </View>
          <Pressable onPress={alternarCurtida}>
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
          <Text style={styles.tempo}>{formatar(total)}</Text>
        </View>

        {!musica.previewUrl && (
          <Text style={styles.aviso}>Prévia indisponível para essa música.</Text>
        )}

        <View style={styles.controles}>
          <Pressable onPress={() => setAleatorio(!aleatorio)}>
            <Ionicons name="shuffle" size={26} color={aleatorio ? cores.verde : cores.textoSecundario} />
          </Pressable>
          <Pressable onPress={() => irPara(-1)}>
            <Ionicons name="play-skip-back" size={34} color={cores.texto} />
          </Pressable>
          <Pressable style={styles.play} onPress={alternarPlay}>
            <Ionicons name={tocando ? 'pause' : 'play'} size={34} color="#000" />
          </Pressable>
          <Pressable onPress={() => irPara(1)}>
            <Ionicons name="play-skip-forward" size={34} color={cores.texto} />
          </Pressable>
          <Pressable onPress={() => setRepetir(!repetir)}>
            <Ionicons name="repeat" size={26} color={repetir ? cores.verde : cores.textoSecundario} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#2A1B3D' },
  centro: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  conteudo: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', paddingHorizontal: 24 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  topoTexto: { flex: 1, color: cores.texto, fontSize: 13, fontWeight: '600', textAlign: 'center', marginHorizontal: 12 },
  capa: { alignSelf: 'center', borderRadius: 8, marginTop: 24, backgroundColor: '#3A2A4D' },
  info: { flexDirection: 'row', alignItems: 'center', marginTop: 28 },
  titulo: { color: cores.texto, fontSize: 24, fontWeight: '800' },
  artista: { color: cores.textoSecundario, fontSize: 16, marginTop: 4 },
  trilha: { height: 4, backgroundColor: '#5A4A6A', borderRadius: 2, marginTop: 24 },
  progresso: { height: 4, backgroundColor: cores.texto, borderRadius: 2 },
  tempos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  tempo: { color: cores.textoSecundario, fontSize: 12 },
  aviso: { color: cores.textoSecundario, fontSize: 12, textAlign: 'center', marginTop: 12 },
  controles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  play: { width: 68, height: 68, borderRadius: 34, backgroundColor: cores.texto, alignItems: 'center', justifyContent: 'center' },
  textoErro: { color: cores.textoSecundario, textAlign: 'center', paddingHorizontal: 24 },
  botaoVoltar: { marginTop: 12, backgroundColor: cores.verde, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  textoBotaoVoltar: { color: '#000', fontWeight: '700' },
});