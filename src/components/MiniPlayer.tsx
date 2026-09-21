import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { musicas } from '@/data/musicas';

export default function MiniPlayer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const musica = musicas[0];

  return (
    <Pressable
      style={[styles.container, { bottom: 60 + insets.bottom }]}
      onPress={() => router.push({ pathname: '/player', params: { id: musica.id } })}
    >
      <Image source={musica.capa} style={styles.capa} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>{musica.titulo}</Text>
        <Text style={styles.artista} numberOfLines={1}>{musica.artista}</Text>
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