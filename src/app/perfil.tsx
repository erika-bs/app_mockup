import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { cores } from '@/constants/cores';
import { useAuth } from '@/contexts/AuthContext';
import { listarDescobertas } from '@/storage/descobertas';
import { listarHistorico } from '@/storage/historico';

const opcoes = [
  { texto: 'Conta', icone: 'person-outline' as const },
  { texto: 'Qualidade do áudio', icone: 'musical-note-outline' as const },
  { texto: 'Notificações', icone: 'notifications-outline' as const },
  { texto: 'Privacidade', icone: 'lock-closed-outline' as const },
  { texto: 'Ajuda', icone: 'help-circle-outline' as const },
];

export default function Perfil() {
  const router = useRouter();
  const { usuario, sair } = useAuth();
  const [salvas, setSalvas] = useState(0);
  const [reproducoes, setReproducoes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      listarDescobertas().then((l) => setSalvas(l.length));
      listarHistorico().then((l) => setReproducoes(l.length));
    }, [])
  );

  const inicial = usuario?.nome?.trim().charAt(0).toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </Pressable>

        <View style={styles.cabecalho}>
          <View style={styles.avatar}>
            <Text style={styles.inicial}>{inicial}</Text>
          </View>
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
          <Text style={styles.estatisticas}>
            {salvas} {salvas === 1 ? 'música salva' : 'músicas salvas'} • {reproducoes}{' '}
            {reproducoes === 1 ? 'reprodução' : 'reproduções'}
          </Text>
        </View>

        <Text style={styles.secao}>Configurações</Text>
        {opcoes.map((o) => (
          <View key={o.texto} style={styles.linha}>
            <Ionicons name={o.icone} size={22} color={cores.texto} />
            <Text style={styles.linhaTexto}>{o.texto}</Text>
            <Ionicons name="chevron-forward" size={18} color={cores.textoSecundario} />
          </View>
        ))}

        <Pressable style={styles.sair} onPress={sair}>
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
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center' },
  inicial: { color: '#000', fontSize: 48, fontWeight: '800' },
  nome: { color: cores.texto, fontSize: 24, fontWeight: '800', marginTop: 12 },
  email: { color: cores.textoSecundario, marginTop: 4 },
  estatisticas: { color: cores.textoSecundario, marginTop: 4, fontSize: 13 },
  secao: { color: cores.texto, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  linhaTexto: { flex: 1, color: cores.texto, fontSize: 16, marginLeft: 14 },
  sair: { borderWidth: 1, borderColor: cores.textoSecundario, borderRadius: 30, paddingVertical: 12, alignItems: 'center', marginTop: 24 },
  sairTexto: { color: cores.texto, fontWeight: '700' },
});