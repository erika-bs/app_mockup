import { RespostaBusca, ResultadoBusca } from '@/types/api';

const BASE = 'https://itunes.apple.com';

async function req<T>(path: string): Promise<T> {
  const resposta = await fetch(BASE + path);
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}`);
  }
  return (await resposta.json()) as T;
}

export const api = {
  buscarMusicas: (termo: string) =>
    req<RespostaBusca>(`/search?term=${encodeURIComponent(termo)}&entity=song&limit=25`),

  buscarPorId: async (trackId: number): Promise<ResultadoBusca | null> => {
    const resposta = await req<RespostaBusca>(`/lookup?id=${trackId}`);
    return resposta.results[0] ?? null;
  },

  buscarDiscografia: (artistId: number) =>
    req<RespostaBusca>(`/lookup?id=${artistId}&entity=album&limit=20`),
};