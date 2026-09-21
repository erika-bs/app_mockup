import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cores } from '@/constants/cores';

const opcoes = [
  { texto: 'Conta', icone: 'person-outline' as const },
  { texto: 'Qualidade do áudio', icone: 'musical-note-outline' as const },
  { texto: 'Notificações', icone: 'notifications-outline' as const },
  { texto: 'Privacidade', icone: 'lock-closed-outline' as const },
  { texto: 'Ajuda', icone: 'help-circle-outline' as const },
];

export default function Perfil() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        <View style={styles.cabecalho}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={56} color={cores.textoSecundario} />
          </View>
          <Text style={styles.nome}>Seu Nome</Text>
          <Text style={styles.seguidores}>12 playlists públicas • 34 seguidores</Text>
        </View>

        <Text style={styles.secao}>Configurações</Text>
        {opcoes.map((o) => (
          <View key={o.texto} style={styles.linha}>
            <Ionicons name={o.icone} size={22} color={cores.texto} />
            <Text style={styles.linhaTexto}>{o.texto}</Text>
            <Ionicons name="chevron-forward" size={18} color={cores.textoSecundario} />
          </View>
        ))}

        <Pressable style={styles.sair} onPress={() => router.replace('/login')}>
          <Text style={styles.sairTexto}>Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, paddingBottom: 60 },
  cabecalho: { alignItems: 'center', marginVertical: 24 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: cores.card, alignItems: 'center', justifyContent: 'center' },
  nome: { color: cores.texto, fontSize: 24, fontWeight: '800', marginTop: 12 },
  seguidores: { color: cores.textoSecundario, marginTop: 4 },
  secao: { color: cores.texto, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  linhaTexto: { flex: 1, color: cores.texto, fontSize: 16, marginLeft: 14 },
  sair: { borderWidth: 1, borderColor: cores.textoSecundario, borderRadius: 30, paddingVertical: 12, alignItems: 'center', marginTop: 24 },
  sairTexto: { color: cores.texto, fontWeight: '700' },
});