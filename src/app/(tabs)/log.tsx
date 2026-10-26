import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useLogs } from '../../api/queries';
import { LogForm } from '../../components/LogForm';
import { LogItem } from '../../components/LogItem'; // Importa el nuevo componente
import { LogEntry } from '../../types/log';

export default function LogScreen() {
  const { data: logs, isLoading, isError, refetch, isRefetching } = useLogs();

  return (
    <View style={styles.container}>
      <LogForm />
      {isLoading && !isRefetching && <ActivityIndicator size="large" color="indigo" />}
      {isError && <Text style={styles.errorText}>Error al cargar la bitácora</Text>}
      
      {!isLoading && !isError && (
        <FlatList
          data={logs ?? []}
          keyExtractor={(item: LogEntry) => item.id}
          renderItem={({ item }) => <LogItem item={item} />} // Usa el componente LogItem
          ListEmptyComponent={<Text style={{ padding: 16, textAlign: 'center' }}>No hay notas aún.</Text>}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      )}
    </View>
  );
}
// Mantén tus estilos actuales

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 8, elevation: 1 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  errorText: { color: 'red', padding: 16, textAlign: 'center' }
});