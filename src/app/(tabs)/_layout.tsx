import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '@/constants/cores';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: cores.texto,
          tabBarInactiveTintColor: cores.textoSecundario,
          tabBarStyle: { backgroundColor: '#000', borderTopWidth: 0 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="biblioteca"
          options={{
            title: 'Sua Biblioteca',
            tabBarIcon: ({ color, size }) => <Ionicons name="library" color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
  );
}