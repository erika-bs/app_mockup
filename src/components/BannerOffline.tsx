import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BannerOffline() {
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#000" />
      <Text style={styles.texto}>Você está offline — mostrando dados salvos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8C547',
    paddingVertical: 6,
    gap: 6,
  },
  texto: { color: '#000', fontSize: 12, fontWeight: '600' },
});