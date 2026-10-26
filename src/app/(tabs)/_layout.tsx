import { Tabs } from 'expo-router';
import { Telescope, Orbit, Book } from 'lucide-react-native';
import { NasaColors } from '../../constants/nasaTheme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NasaColors.accentBlue,
        tabBarInactiveTintColor: NasaColors.textSecondary,
        tabBarStyle: {
          backgroundColor: NasaColors.surface,
          borderTopColor: NasaColors.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        sceneStyle: { backgroundColor: NasaColors.background },
      }}
    >
      <Tabs.Screen
        name="apod"
        options={{
          title: 'Descubrimiento',
          headerShown: true,
          headerStyle: { backgroundColor: NasaColors.background },
          headerShadowVisible: false,
          headerTintColor: NasaColors.textPrimary,
          headerTitleStyle: { color: NasaColors.textPrimary, fontWeight: '700' },
          tabBarIcon: ({ color }) => <Telescope color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="asteroids"
        options={{
          title: 'Asteroides',
          tabBarIcon: ({ color }) => <Orbit color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Mi Bitácora',
          tabBarIcon: ({ color }) => <Book color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
