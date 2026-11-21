import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { ultimaReproducao, RegistroHistorico } from '@/storage/historico';

export default function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [ultima, setUltima] = useState<RegistroHistorico | null>(null);

  useEffect(() => {
    ultimaReproducao().then(setUltima);
  }, [pathname]);

  if (!ultima || pathname.startsWith('/player')) return null;

  return (
    <Pressable
      style={[styles.container, { bottom: 60 + insets.bottom }]}
      onPress={() => router.push({ pathname: '/player', params: { id: String(ultima.trackId) } })}
    >
      <Image source={{ uri: ultima.artworkUrl100 }} style={styles.capa} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>{ultima.trackName}</Text>
        <Text style={styles.artista} numberOfLines={1}>{ultima.artistName}</Text>
      </View>
      <Ionicons name="play" size={24} color={cores.texto} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A2A4A',
    borderRadius: 8,
    padding: 8,
  },
  capa: { width: 40, height: 40, borderRadius: 4 },
  textos: { flex: 1, marginLeft: 10 },
  titulo: { color: cores.texto, fontWeight: '700' },
  artista: { color: cores.textoSecundario, fontSize: 12 },
});