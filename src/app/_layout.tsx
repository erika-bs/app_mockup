import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cores } from '@/constants/cores';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={cores.verde} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack.Protected>

      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="ajuda" />
        <Stack.Screen name="historico" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="artista/[id]" />
        <Stack.Screen name="playlist/[id]" />
        <Stack.Screen name="resultado/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Rotas />
    </AuthProvider>
  );
}