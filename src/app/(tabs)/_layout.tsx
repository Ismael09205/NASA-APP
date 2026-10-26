import { Tabs } from 'expo-router';
import { Telescope, Orbit, Book } from 'lucide-react-native';


export default function TabLayout() {
  return (
    
    <Tabs screenOptions={{ tabBarActiveTintColor: 'indigo', headerShown: true }}>
      <Tabs.Screen
        name="apod"
        options={{
          title: 'Descubrimiento',
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