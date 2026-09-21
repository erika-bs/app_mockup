import { ImageSourcePropType } from 'react-native';

export type Artista = {
  id: string;
  nome: string;
  genero: string;
  foto: ImageSourcePropType;
};

export const artistas: Artista[] = [
  { id: 'a1', nome: 'Hawthorne Heights', genero: 'Emo / Post-hardcore', foto: require('../../assets/images/capas/01.png') },
  { id: 'a2', nome: 'RBD', genero: 'Pop latino', foto: require('../../assets/images/capas/02.png') },
  { id: 'a3', nome: 'Blutengel', genero: 'Dark electro', foto: require('../../assets/images/capas/03.png') },
  { id: 'a4', nome: 'Tokio Hotel', genero: 'Pop rock alemão', foto: require('../../assets/images/capas/04.png') },
  { id: 'a5', nome: 'Gene Loves Jezebel', genero: 'Rock gótico', foto: require('../../assets/images/capas/05.png') },
  { id: 'a6', nome: 'Sisters of Mercy', genero: 'Rock gótico', foto: require('../../assets/images/capas/06.png') },
  { id: 'a7', nome: 'My Chemical Romance', genero: 'Rock alternativo', foto: require('../../assets/images/capas/07.png') },
  { id: 'a8', nome: 'Lebanon Hanover', genero: 'Cold wave', foto: require('../../assets/images/capas/08.png') },
  { id: 'a9', nome: 'La Dispute', genero: 'Post-hardcore', foto: require('../../assets/images/capas/09.png') },
  { id: 'a10', nome: 'Blink-182', genero: 'Pop punk', foto: require('../../assets/images/capas/11.png') },
  { id: 'a11', nome: 'Underoath', genero: 'Metalcore / Post-hardcore', foto: require('../../assets/images/capas/12.png') },
  { id: 'a12', nome: 'The All-American Rejects', genero: 'Pop punk / Rock alternativo', foto: require('../../assets/images/capas/13.png') },
  { id: 'a13', nome: 'Aiden', genero: 'Post-hardcore', foto: require('../../assets/images/capas/14.png') },
  { id: 'a14', nome: 'Yellowcard', genero: 'Pop punk', foto: require('../../assets/images/capas/15.png') },
];