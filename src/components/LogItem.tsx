import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { LogEntry } from '../types/log';
import { EditLogData } from '../api/mutations';

export function LogItem({ item }: { item: LogEntry }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note);

  const { mutate: editLog, isPending: isEditingPending } = useMutation<any, Error, EditLogData>({ mutationKey: ['editLog'] });
  const { mutate: deleteLog, isPending: isDeletingPending } = useMutation<any, Error, string>({ mutationKey: ['deleteLog'] });
  
  // CORRECCIÓN: Ejecutar los hooks de forma independiente antes de evaluarlos
  const editingMutations = useIsMutating({ mutationKey: ['editLog'] });
  const deletingMutations = useIsMutating({ mutationKey: ['deleteLog'] });
  const isMutating = editingMutations > 0 || deletingMutations > 0;

  const handleSave = () => {
    editLog({ id: item.id, title, note }, { onSuccess: () => setIsEditing(false) });
  };

  const isBusy = isEditingPending || isDeletingPending || isMutating;

  if (isEditing) {
    return (
      <View style={styles.card}>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput value={note} onChangeText={setNote} multiline style={styles.input} />
        <View style={styles.row}>
          <Button title="Cancelar" onPress={() => setIsEditing(false)} color="gray" disabled={isBusy} />
          <Button title="Guardar" onPress={handleSave} disabled={isBusy} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.note}</Text>
      {isBusy && <ActivityIndicator size="small" color="indigo" />}
      <View style={[styles.row, { marginTop: 12 }]}>
        <Button title="Editar" onPress={() => setIsEditing(true)} disabled={isBusy} />
        <Button title="Eliminar" color="red" onPress={() => deleteLog(item.id)} disabled={isBusy} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 8, elevation: 1 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});