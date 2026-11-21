import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { api } from '@/services/api';
import { ResultadoBusca } from '@/types/api';
import { salvarDescoberta, removerDescoberta, estaSalva } from '@/storage/descobertas';

export default function ResultadoBuscaTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [salva, setSalva] = useState(false);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    setCarregando(true);
    setErro(false);
    try {
      const dado = await api.buscarPorId(Number(id));
      setResultado(dado);
      if (dado) {
        setSalva(await estaSalva(dado.trackId));
      }
    } catch (e) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  async function alternarSalvar() {
    if (!resultado) return;
    if (salva) {
      await removerDescoberta(resultado.trackId);
      setSalva(false);
    } else {
      await salvarDescoberta(resultado);
      setSalva(true);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (erro || !resultado) {
    return (
      <View style={styles.centro}>
        <Ionicons name="alert-circle-outline" size={48} color="#E8514B" />
        <Text style={styles.textoErro}>Não foi possível carregar esse resultado.</Text>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Image source={{ uri: resultado.artworkUrl100.replace('100x100', '400x400') }} style={styles.capa} />

      <Text style={styles.nome}>{resultado.trackName}</Text>

      <TouchableOpacity onPress={() => router.push(`/artista/${resultado.artistId}`)}>
        <Text style={styles.artista}>{resultado.artistName}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(`/album/${resultado.collectionId}`)}>
        <Text style={[styles.detalhe, styles.linkAlbum]}>{resultado.collectionName}</Text>
      </TouchableOpacity>

      <Text style={styles.detalhe}>{resultado.primaryGenreName} · {new Date(resultado.releaseDate).getFullYear()}</Text>

      <View style={styles.linhaBotoes}>
        <TouchableOpacity
          style={styles.botaoTocar}
          onPress={() => router.push(`/player?id=${resultado.trackId}`)}
        >
          <Ionicons name="play" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSalvar} onPress={alternarSalvar}>
          <Ionicons name={salva ? 'heart' : 'heart-outline'} size={20} color={salva ? '#1DB954' : '#fff'} />
          <Text style={styles.textoSalvar}>{salva ? 'Salvo em Favoritos' : 'Salvar em Favoritos'}</Text>
        </TouchableOpacity>
      </View>

      {resultado.trackViewUrl && (
        <TouchableOpacity onPress={() => Linking.openURL(resultado.trackViewUrl)}>
          <Text style={styles.link}>Ver na Apple Music</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center' },
  centro: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', gap: 12 },
  voltar: { alignSelf: 'flex-start', marginBottom: 12 },
  capa: { width: 220, height: 220, borderRadius: 8, backgroundColor: '#242424', marginBottom: 20 },
  nome: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  artista: { color: '#1DB954', fontSize: 15, marginTop: 4, textDecorationLine: 'underline' },
  detalhe: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },
  linkAlbum: { color: '#1DB954', textDecorationLine: 'underline' },
  linhaBotoes: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 },
  botaoTocar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center',
  },
  botaoSalvar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#242424', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24,
  },
  textoSalvar: { color: '#fff', fontWeight: '600' },
  link: { color: '#1DB954', marginTop: 16, fontSize: 13 },
  textoErro: { color: '#B3B3B3', textAlign: 'center' },
  botaoVoltar: { marginTop: 12, backgroundColor: '#1DB954', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  textoBotaoTentar: { color: '#000', fontWeight: '700' },
  textoBotaoVoltar: { color: '#000', fontWeight: '700' },
});