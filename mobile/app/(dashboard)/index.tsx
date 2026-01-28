import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pacientes: 0, agenda: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single();
      const clinicaId = profile?.clinica_id;

      if (clinicaId) {
        const { count: pacientesCount } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .eq('clinica_id', clinicaId);

        const today = new Date().toISOString().split('T')[0];
        const { count: agendaCount } = await supabase
          .from('atendimentos')
          .select('*', { count: 'exact', head: true })
          .eq('clinica_id', clinicaId)
          .gte('data_hora', `${today}T00:00:00`)
          .lt('data_hora', `${today}T23:59:59`);

        setStats({ pacientes: pacientesCount || 0, agenda: agendaCount || 0 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Pacientes</Text>
        <Text style={styles.cardValue}>{stats.pacientes}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Atendimentos Hoje</Text>
        <Text style={styles.cardValue}>{stats.agenda}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 16, color: '#666' },
  cardValue: { fontSize: 32, fontWeight: 'bold', marginTop: 5 },
});
