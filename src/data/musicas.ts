import { ImageSourcePropType } from 'react-native';

export type Musica = {
  id: string;
  titulo: string;
  artista: string;
  artistaId: string;
  album: string;
  duracao: string;
  capa: ImageSourcePropType;
};

export const musicas: Musica[] = [
  { id: '1', titulo: 'Niki FM', artista: 'Hawthorne Heights', artistaId: 'a1', album: 'The Silence in Black and White', duracao: '3:30', capa: require('../../assets/images/capas/01.png') },
  { id: '2', titulo: 'Quisiera Ser', artista: 'RBD', artistaId: 'a2', album: 'Celestial', duracao: '3:25', capa: require('../../assets/images/capas/02.png') },
  { id: '3', titulo: 'Reich mir die Hand', artista: 'Blutengel', artistaId: 'a3', album: 'Tränenherz', duracao: '3:25', capa: require('../../assets/images/capas/03.png') },
  { id: '4', titulo: 'Durch den Monsun', artista: 'Tokio Hotel', artistaId: 'a4', album: 'Schrei', duracao: '4:00', capa: require('../../assets/images/capas/04.png') },
  { id: '5', titulo: 'Desire (Come and Get It)', artista: 'Gene Loves Jezebel', artistaId: 'a5', album: 'Discover', duracao: '4:15', capa: require('../../assets/images/capas/05.png') },
  { id: '6', titulo: 'Marian', artista: 'Sisters of Mercy', artistaId: 'a6', album: 'First and Last and Always', duracao: '6:30', capa: require('../../assets/images/capas/06.png') },
  { id: '7', titulo: 'Disenchanted', artista: 'My Chemical Romance', artistaId: 'a7', album: 'The Black Parade', duracao: '4:55', capa: require('../../assets/images/capas/07.png') },
  { id: '8', titulo: 'Kiss Me Until My Lips Fall Off', artista: 'Lebanon Hanover', artistaId: 'a8', album: 'Let Them Be Alien', duracao: '4:20', capa: require('../../assets/images/capas/08.png') },
  { id: '9', titulo: 'Such Small Hands', artista: 'La Dispute', artistaId: 'a9', album: 'Somewhere at the Bottom of the River Between Vega and Altair', duracao: '5:10', capa: require('../../assets/images/capas/09.png') },
  { id: '10', titulo: 'Skylines and Turnstiles', artista: 'My Chemical Romance', artistaId: 'a7', album: 'I Brought You My Bullets, You Brought Me Your Love', duracao: '3:20', capa: require('../../assets/images/capas/10.png') },
];