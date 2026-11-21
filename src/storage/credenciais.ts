import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ehWeb = Platform.OS === 'web';

export const credenciais = {
  salvar: async (chave: string, valor: string) => {
    if (ehWeb) {
      await AsyncStorage.setItem(chave, valor);
    } else {
      await SecureStore.setItemAsync(chave, valor);
    }
  },
  ler: async (chave: string): Promise<string | null> => {
    if (ehWeb) {
      return AsyncStorage.getItem(chave);
    }
    return SecureStore.getItemAsync(chave);
  },
  remover: async (chave: string) => {
    if (ehWeb) {
      await AsyncStorage.removeItem(chave);
    } else {
      await SecureStore.deleteItemAsync(chave);
    }
  },
};