import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '@/constants/cores';
import { categorias } from '@/data/categorias';
import { musicas } from '@/data/musicas';
import ItemFaixa from '@/components/ItemFaixa';

export default function Buscar() {
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLowerCase();

  const resultados = musicas.filter(
    (m) => m.titulo.toLowerCase().includes(termo) || m.artista.toLowerCase().includes(termo)
  );

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.campo}>
          <Ionicons name="search" size={22} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="O que você quer ouvir?"
            placeholderTextColor="#555"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {termo === '' ? (
          <>
            <Text style={styles.secao}>Navegar por todas as seções</Text>
            <View style={styles.grade}>
              {categorias.map((c) => (
                <View key={c.nome} style={[styles.categoria, { backgroundColor: c.cor }]}>
                  <Text style={styles.categoriaTexto}>{c.nome}</Text>
                </View>
              ))}
            </View>
          </>
        ) : resultados.length > 0 ? (
          resultados.map((m) => <ItemFaixa key={m.id} musica={m} />)
        ) : (
          <Text style={styles.vazio}>Nenhum resultado para "{busca}"</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 150 },
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', marginBottom: 16 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.texto,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#000' },
  secao: { color: cores.texto, fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoria: { width: '48%', height: 90, borderRadius: 8, padding: 12, marginBottom: 12 },
  categoriaTexto: { color: cores.texto, fontSize: 18, fontWeight: '800' },
  vazio: { color: cores.textoSecundario, marginTop: 24, textAlign: 'center' },
});