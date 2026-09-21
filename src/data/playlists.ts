import { ImageSourcePropType } from 'react-native';

export type Playlist = {
  id: string;
  nome: string;
  descricao: string;
  capa: ImageSourcePropType;
  faixas: string[];
};

export const playlists: Playlist[] = [
  { id: '1', nome: 'Emo Noite Adentro', descricao: 'Para ouvir de fone às 3 da manhã', capa: require('../../assets/images/capas/01.jpg'), faixas: ['1', '7', '9', '10'] },
  { id: '2', nome: 'Gótico', descricao: 'Sombras e sintetizadores', capa: require('../../assets/images/capas/06.jpg'), faixas: ['3', '5', '6', '8'] },
  { id: '3', nome: 'Nostalgia 2000s', descricao: 'Direto da adolescência', capa: require('../../assets/images/capas/04.jpg'), faixas: ['2', '4', '7', '1'] },
  { id: '4', nome: 'Post-punk', descricao: 'Baixo marcado e voz grave', capa: require('../../assets/images/capas/08.jpg'), faixas: ['6', '8', '5'] },
  { id: '5', nome: 'Mix do Dia', descricao: 'Feito para você', capa: require('../../assets/images/capas/03.jpg'), faixas: ['1', '2', '3', '4', '5'] },
  { id: '6', nome: 'Descobertas', descricao: 'Novidades da semana', capa: require('../../assets/images/capas/09.jpg'), faixas: ['9', '8', '3', '6'] },
];