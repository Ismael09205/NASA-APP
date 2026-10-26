// app/(tabs)/asteroids.tsx
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAsteroids } from '../../api/queries';
import { Asteroid } from '../../types/nasa';

export default function AsteroidsScreen() {
  const { data: asteroids, isLoading, isError, refetch, isRefetching } = useAsteroids();

  const renderItem = ({ item }: { item: Asteroid }) => (
    <View style={[styles.card, item.is_potentially_hazardous_asteroid && styles.hazardousCard]}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Diámetro max: {item.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</Text>
      {item.is_potentially_hazardous_asteroid && (
        <Text style={styles.warning}>⚠️ Potencialmente peligroso</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Asteroides Cercanos Hoy</Text>
      
      {isLoading && !isRefetching && <ActivityIndicator size="large" color="indigo" />}
      {isError && <Text style={styles.errorText}>Error al conectar con la NASA</Text>}
      
      {!isLoading && !isError && (
        <FlatList
          data={asteroids ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Cielo despejado hoy.</Text>}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 16 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  card: { padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 8, elevation: 1 },
  hazardousCard: { borderColor: '#ff4444', borderWidth: 1, backgroundColor: '#fff0f0' },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  warning: { color: '#ff4444', fontWeight: 'bold', marginTop: 8 },
  errorText: { color: 'red', padding: 16, textAlign: 'center' },
  empty: { padding: 16, textAlign: 'center' }
});