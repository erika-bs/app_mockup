import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResultadoBusca } from '@/types/api';

const CHAVE = '@descobertas';

export async function listarDescobertas(): Promise<ResultadoBusca[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  return bruto ? JSON.parse(bruto) : [];
}

export async function salvarDescoberta(resultado: ResultadoBusca): Promise<void> {
  const lista = await listarDescobertas();
  const jaExiste = lista.some((item) => item.trackId === resultado.trackId);
  if (jaExiste) return;
  const nova = [resultado, ...lista];
  await AsyncStorage.setItem(CHAVE, JSON.stringify(nova));
}

export async function removerDescoberta(trackId: number): Promise<void> {
  const lista = await listarDescobertas();
  const nova = lista.filter((item) => item.trackId !== trackId);
  await AsyncStorage.setItem(CHAVE, JSON.stringify(nova));
}

export async function estaSalva(trackId: number): Promise<boolean> {
  const lista = await listarDescobertas();
  return lista.some((item) => item.trackId === trackId);
}