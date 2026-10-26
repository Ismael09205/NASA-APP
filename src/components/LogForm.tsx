// src/components/LogForm.tsx
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { NewLogData } from '../api/mutations';

const logSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  note: z.string().min(10, 'La nota debe tener al menos 10 caracteres'),
});

export function LogForm() {
  const isMutating = useIsMutating({ mutationKey: ['addLog'] });
  const { mutate, isPending } = useMutation<any, Error, NewLogData>({ mutationKey: ['addLog'] });

  const { control, handleSubmit, formState: { errors }, reset } = useForm<NewLogData>({
    resolver: zodResolver(logSchema),
    defaultValues: { title: '', note: '' }
  });

  const onSubmit = (data: NewLogData) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Título (ej. Júpiter)" onChangeText={onChange} value={value} style={styles.input} />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Notas de la observación..." onChangeText={onChange} value={value} multiline style={[styles.input, styles.textArea]} />
        )}
      />
      {errors.note && <Text style={styles.error}>{errors.note.message}</Text>}

      <Button 
        title={(isPending || isMutating > 0) ? "Guardando offline..." : "Registrar"} 
        onPress={handleSubmit(onSubmit)} 
        disabled={isPending || isMutating > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 },
  textArea: { height: 80, textAlignVertical: 'top' },
  error: { color: 'red', marginBottom: 8 }
});