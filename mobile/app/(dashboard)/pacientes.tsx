import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PacientesScreen() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchPacientes();
    }, [])
  );

  const fetchPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pacientes').select('id, nome, cpf, telefone');
    if (!error) setPacientes(data || []);
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Pacientes</Text>
        <Button title="Novo" onPress={() => router.push('/(dashboard)/pacientes/new')} />
      </View>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/(dashboard)/pacientes/${item.id}`)}
          >
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.detail}>{item.cpf}</Text>
            <Text style={styles.detail}>{item.telefone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  name: { fontSize: 18, fontWeight: '600' },
  detail: { color: '#666', marginTop: 2 },
});
