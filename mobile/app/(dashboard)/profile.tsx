import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile({ ...data, email: user.email });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (!profile) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{profile.full_name?.substring(0, 2).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{profile.full_name}</Text>
      <Text style={styles.role}>{profile.role?.toUpperCase()}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Sair" color="#ff3b30" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  initials: { fontSize: 32, fontWeight: 'bold', color: '#555' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  role: { fontSize: 16, color: '#007AFF', marginBottom: 5, fontWeight: '600' },
  email: { fontSize: 16, color: '#666', marginBottom: 40 },
  buttonContainer: { width: '100%', maxWidth: 200 }
});
