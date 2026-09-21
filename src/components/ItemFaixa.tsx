import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { Musica } from '@/data/musicas';

export default function ItemFaixa({ musica }: { musica: Musica }) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.linha}
      onPress={() => router.push({ pathname: '/player', params: { id: musica.id } })}
    >
      <Image source={musica.capa} style={styles.capa} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>{musica.titulo}</Text>
        <Text style={styles.artista} numberOfLines={1}>{musica.artista}</Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={18} color={cores.textoSecundario} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  capa: { width: 48, height: 48, borderRadius: 4, backgroundColor: cores.card },
  textos: { flex: 1, marginLeft: 12 },
  titulo: { color: cores.texto, fontSize: 16 },
  artista: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
});