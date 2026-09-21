import { Image, ImageSourcePropType, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '@/constants/cores';

type Props = {
  titulo: string;
  subtitulo: string;
  capa: ImageSourcePropType;
  onPress: () => void;
};

export default function CardMusica({ titulo, subtitulo, capa, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={capa} style={styles.capa} />
      <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
      <Text style={styles.subtitulo} numberOfLines={1}>{subtitulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, marginRight: 14 },
  capa: { width: 140, height: 140, borderRadius: 6, backgroundColor: cores.card },
  titulo: { color: cores.texto, fontWeight: '700', marginTop: 8 },
  subtitulo: { color: cores.textoSecundario, fontSize: 12, marginTop: 2 },
});