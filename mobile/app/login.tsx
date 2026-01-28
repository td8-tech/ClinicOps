import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      router.replace('/(dashboard)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="medical" size={60} color="#007AFF" />
        <Text style={styles.appName}>ClinicOps</Text>
      </View>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput 
          placeholder="Senha" 
          secureTextEntry={!showPassword} 
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <Button title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
      
      <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => router.push('/signup')}>Criar Conta</Text>
        <Text style={styles.link} onPress={() => router.push('/reset-password')}>Esqueci a Senha</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginTop: 10 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  passwordInput: { flex: 1 },
  linksContainer: { marginTop: 20, alignItems: 'center', gap: 10 },
  link: { color: '#007AFF', fontSize: 16 }
});
