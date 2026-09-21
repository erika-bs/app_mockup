import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cores } from '@/constants/cores';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}