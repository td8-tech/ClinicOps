import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AgendaScreen() {
  const router = useRouter();
  const [agenda, setAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchAgenda();
    }, [])
  );

  const fetchAgenda = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if user is medico to filter (though RLS/Query logic handles most)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
    
    let query = supabase.from('atendimentos').select('*, pacientes(nome)');
    
    if (profile?.role === 'medico') {
        query = query.eq('profissional_id', user?.id);
    }

    const { data, error } = await query.order('data_hora', { ascending: true });
    
    if (!error) setAgenda(data || []);
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Agenda</Text>
        <Button title="Novo" onPress={() => router.push('/(dashboard)/agenda/new')} />
      </View>
      <FlatList
        data={agenda}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.time}>{new Date(item.data_hora).toLocaleString()}</Text>
            <Text style={styles.patient}>{item.pacientes?.nome}</Text>
            <Text style={styles.desc}>{item.descricao}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum agendamento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#34C759' },
  time: { fontSize: 14, color: '#888', marginBottom: 4 },
  patient: { fontSize: 18, fontWeight: '600' },
  desc: { color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' }
});
