import AsyncStorage from '@react-native-async-storage/async-storage';

export type RegistroHistorico = {
  id: number;
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  tocadoEm: string;
};

const CHAVE_WEB = '@historico_web';

async function lerLista(): Promise<RegistroHistorico[]> {
  const bruto = await AsyncStorage.getItem(CHAVE_WEB);
  return bruto ? JSON.parse(bruto) : [];
}
async function salvarLista(lista: RegistroHistorico[]) {
  await AsyncStorage.setItem(CHAVE_WEB, JSON.stringify(lista));
}

export async function registrarReproducao(musica: {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}) {
  const lista = await lerLista();
  const novoId = lista.length > 0 ? Math.max(...lista.map((l) => l.id)) + 1 : 1;
  lista.unshift({ id: novoId, ...musica, tocadoEm: new Date().toISOString() });
  await salvarLista(lista);
}

export async function listarHistorico(ordenarPor: 'recente' | 'artista' = 'recente'): Promise<RegistroHistorico[]> {
  const lista = await lerLista();
  if (ordenarPor === 'artista') {
    return [...lista].sort((a, b) => a.artistName.localeCompare(b.artistName));
  }
  return [...lista].sort((a, b) => (a.tocadoEm < b.tocadoEm ? 1 : -1));
}

export async function ultimaReproducao(): Promise<RegistroHistorico | null> {
  const lista = await listarHistorico('recente');
  return lista[0] ?? null;
}

export async function limparHistorico() {
  await AsyncStorage.removeItem(CHAVE_WEB);
}