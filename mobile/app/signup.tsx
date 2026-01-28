import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !clinicName || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          clinic_name: clinicName,
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Conta criada! Você já pode entrar.');
      router.replace('/(dashboard)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      
      <TextInput 
        placeholder="Nome Completo" 
        style={styles.input} 
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput 
        placeholder="Nome da Clínica" 
        style={styles.input} 
        value={clinicName}
        onChangeText={setClinicName}
      />

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput 
        placeholder="Senha" 
        secureTextEntry 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      
      <Button title={loading ? "Criando..." : "Cadastrar"} onPress={handleSignup} disabled={loading} />
      
      <Text style={styles.link} onPress={() => router.back()}>Voltar ao Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { color: '#007AFF', fontSize: 16, marginTop: 20, textAlign: 'center' }
});
