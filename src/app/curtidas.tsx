import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { musicas } from '@/data/musicas';
import ItemFaixa from '@/components/ItemFaixa';

const idsCurtidas = ['1', '3', '7', '9', '10'];

export default function Curtidas() {
  const router = useRouter();
  const curtidas = musicas.filter((m) => idsCurtidas.includes(m.id));

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        <View style={styles.cabecalho}>
          <View style={styles.icone}>
            <Ionicons name="heart" size={64} color={cores.texto} />
          </View>
          <Text style={styles.titulo}>Músicas Curtidas</Text>
          <Text style={styles.sub}>{curtidas.length} músicas</Text>
        </View>

        {curtidas.map((m) => (
          <ItemFaixa key={m.id} musica={m} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  cabecalho: { alignItems: 'center', marginVertical: 24 },
  icone: { width: 180, height: 180, borderRadius: 8, backgroundColor: '#4A2FBD', alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '800', marginTop: 16 },
  sub: { color: cores.textoSecundario, marginTop: 4 },
});