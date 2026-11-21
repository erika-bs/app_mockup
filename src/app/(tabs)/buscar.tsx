import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { ResultadoBusca } from '@/types/api';
import { useOnline } from '@/hooks/useOnline';
import BannerOffline from '@/components/BannerOffline';
import ItemResultadoBusca from '@/components/ItemResultadoBusca';
import { useLocalSearchParams } from 'expo-router';

type Estado = 'ocioso' | 'carregando' | 'erro' | 'vazio' | 'sucesso';

export default function Buscar() {
  const { termo: termoInicial } = useLocalSearchParams<{ termo?: string }>();
  const [termo, setTermo] = useState(termoInicial ?? '');
  const [estado, setEstado] = useState<Estado>('ocioso');
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [veioDoCache, setVeioDoCache] = useState(false);
  const online = useOnline();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (termo.trim().length < 2) {
      setEstado('ocioso');
      setResultados([]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      buscar(termo.trim());
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [termo]);

  useEffect(() => {
    if (termoInicial && termoInicial !== termo) {
      setTermo(termoInicial);
    }
}, [termoInicial]);

  async function buscar(termoBusca: string) {
    setEstado('carregando');
    setMensagemErro('');

    try {
      const { dados, doCache } = await comCache(
        `busca:${termoBusca.toLowerCase()}`,
        () => api.buscarMusicas(termoBusca),
        10 * 60_000 // 10 minutos de TTL pra busca
      );

      setVeioDoCache(doCache);

      if (dados.results.length === 0) {
        setEstado('vazio');
        setResultados([]);
      } else {
        setEstado('sucesso');
        setResultados(dados.results);
      }
    } catch (e) {
      setEstado('erro');
      setMensagemErro('Não foi possível buscar agora. Verifique sua conexão.');
    }
  }

  return (
    <View style={styles.container}>
      {!online && <BannerOffline />}

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Buscar</Text>
        <View style={styles.caixaBusca}>
          <Ionicons name="search" size={18} color="#B3B3B3" />
          <TextInput
            style={styles.input}
            placeholder="Artistas, músicas ou álbuns"
            placeholderTextColor="#B3B3B3"
            value={termo}
            onChangeText={setTermo}
            autoCorrect={false}
          />
          {termo.length > 0 && (
            <TouchableOpacity onPress={() => setTermo('')}>
              <Ionicons name="close-circle" size={18} color="#B3B3B3" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {estado === 'ocioso' && (
        <View style={styles.estadoVazio}>
          <Ionicons name="musical-notes-outline" size={48} color="#535353" />
          <Text style={styles.textoEstado}>Busque por músicas, artistas ou álbuns</Text>
        </View>
      )}

      {estado === 'carregando' && (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.textoEstado}>Buscando...</Text>
        </View>
      )}

      {estado === 'erro' && (
        <View style={styles.estadoVazio}>
          <Ionicons name="alert-circle-outline" size={48} color="#E8514B" />
          <Text style={styles.textoEstado}>{mensagemErro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={() => buscar(termo.trim())}>
            <Text style={styles.textoBotaoTentar}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      )}

      {estado === 'vazio' && (
        <View style={styles.estadoVazio}>
          <Ionicons name="search-outline" size={48} color="#535353" />
          <Text style={styles.textoEstado}>Nenhum resultado para "{termo}"</Text>
        </View>
      )}

      {estado === 'sucesso' && (
        <>
          {veioDoCache && <Text style={styles.avisoCache}>Mostrando resultado salvo</Text>}
          <FlatList
            data={resultados}
            keyExtractor={(item) => String(item.trackId)}
            renderItem={({ item }) => (
              <ItemResultadoBusca
                resultado={item}
                aoPressionar={() => router.push(`/resultado/${item.trackId}`)}
              />
            )}
            contentContainerStyle={styles.lista}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  cabecalho: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  caixaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    gap: 8,
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  estadoVazio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 10 },
  textoEstado: { color: '#B3B3B3', fontSize: 14, textAlign: 'center' },
  botaoTentar: { marginTop: 8, backgroundColor: '#1DB954', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  textoBotaoTentar: { color: '#000', fontWeight: '700' },
  avisoCache: { color: '#B3B3B3', fontSize: 12, textAlign: 'center', paddingVertical: 4 },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
});