export type Colecao = {
  id: string;
  titulo: string;
  termoBusca: string;
};

export const colecoes: Colecao[] = [
  { id: 'emo', titulo: 'Emo Noite Adentro', termoBusca: 'emo rock' },
  { id: 'gotico', titulo: 'Gótico', termoBusca: 'gothic rock' },
  { id: 'nostalgia2000', titulo: 'Nostalgia 2000s', termoBusca: 'pop punk 2000s' },
  { id: 'postpunk', titulo: 'Post-punk', termoBusca: 'post punk' },
  { id: 'mixdodia', titulo: 'Mix do Dia', termoBusca: 'alternative rock' },
];