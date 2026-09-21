import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';

const opcoes = [
  { texto: 'Continuar com e-mail', icone: 'mail-outline' as const },
  { texto: 'Continuar com Google', icone: 'logo-google' as const },
  { texto: 'Continuar com Apple', icone: 'logo-apple' as const },
];

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.conteudo}>
        <View style={styles.logo}>
          <Ionicons name="musical-notes" size={72} color={cores.verde} />
          <Text style={styles.titulo}>Milhões de músicas.{'\n'}Grátis no seu app.</Text>
        </View>

        <View style={styles.botoes}>
          <Pressable style={styles.primario} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primarioTexto}>Inscreva-se grátis</Text>
          </Pressable>

          {opcoes.map((o) => (
            <Pressable key={o.texto} style={styles.secundario} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name={o.icone} size={22} color={cores.texto} />
              <Text style={styles.secundarioTexto}>{o.texto}</Text>
            </Pressable>
          ))}

          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.entrar}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', padding: 24, justifyContent: 'space-between' },
  logo: { alignItems: 'center', marginTop: 60 },
  titulo: { color: cores.texto, fontSize: 30, fontWeight: '800', textAlign: 'center', marginTop: 24 },
  botoes: { marginBottom: 24 },
  primario: { backgroundColor: cores.verde, borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  primarioTexto: { color: '#000', fontWeight: '800', fontSize: 16 },
  secundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.textoSecundario,
    borderRadius: 30,
    paddingVertical: 14,
    marginBottom: 12,
  },
  secundarioTexto: { color: cores.texto, fontWeight: '700', marginLeft: 10 },
  entrar: { color: cores.texto, fontWeight: '700', textAlign: 'center', marginTop: 12 },
});