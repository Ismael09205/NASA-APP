// app/(tabs)/apod.tsx
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useApod } from '../../api/queries';

export default function ApodScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApod();

  if (isLoading && !isRefetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="indigo" />
        <Text style={{ marginTop: 10 }}>Conectando con la NASA...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar el descubrimiento de hoy.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.date}>{data.date}</Text>
        
        {data.media_type === 'image' ? (
          <Image
            source={{ uri: data.url }}
            style={styles.image}
            contentFit="cover"
            transition={500}
          />
        ) : (
          <View style={styles.videoFallback}>
            <Text style={styles.videoText}>
              El descubrimiento de hoy es un formato interactivo o de video (media_type: {data.media_type}).
            </Text>
          </View>
        )}

        <Text style={styles.explanation}>{data.explanation}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2, marginBottom: 32 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  date: { fontSize: 14, color: '#666', marginBottom: 12 },
  image: { width: '100%', height: 300, borderRadius: 8, backgroundColor: '#000', marginBottom: 16 },
  videoFallback: { width: '100%', height: 150, backgroundColor: '#ddd', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16, padding: 16 },
  videoText: { textAlign: 'center', color: '#555' },
  explanation: { fontSize: 16, lineHeight: 24, color: '#444', textAlign: 'justify' },
  errorText: { color: 'red', fontSize: 16 }
});