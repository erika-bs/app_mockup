import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ResultadoBusca } from '@/types/api';

type Props = {
  resultado: ResultadoBusca;
  aoPressionar: () => void;
};

export default function ItemResultadoBusca({ resultado, aoPressionar }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={aoPressionar}>
      <Image source={{ uri: resultado.artworkUrl100 }} style={styles.capa} />
      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={1}>{resultado.trackName}</Text>
        <Text style={styles.artista} numberOfLines={1}>{resultado.artistName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  capa: { width: 50, height: 50, borderRadius: 4, backgroundColor: '#242424' },
  textos: { flex: 1 },
  nome: { color: '#fff', fontSize: 15, fontWeight: '600' },
  artista: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },
});