import AsyncStorage from '@react-native-async-storage/async-storage'

type Entrada<T> = { dados: T; salvoEm: number };

export async function comCache<T>(
  chave: string,
  buscar: () => Promise<T>,
  ttlMs = 5 * 60_000
): Promise<{ dados: T; doCache: boolean }> {
  const bruto = await AsyncStorage.getItem(chave);
  const guardado: Entrada<T> | null = bruto ? JSON.parse(bruto) : null;
  const fresco = guardado && Date.now() - guardado.salvoEm < ttlMs;

  if (fresco) {
    return { dados: guardado!.dados, doCache: true };
  }

  try {
    const dados = await buscar();
    await AsyncStorage.setItem(chave, JSON.stringify({ dados, salvoEm: Date.now() }));
    return { dados, doCache: false };
  } catch (e) {
    if (guardado) {
      return { dados: guardado.dados, doCache: true };
    }
    throw e;
  }
}