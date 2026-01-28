import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return Alert.alert('Erro', 'Informe seu email');

    setLoading(true);
    // Note: Deep linking needs to be configured for this to redirect back to app
    // For now, we redirect to the web reset page which handles the token exchange
    // We append a timestamp to prevent caching and ensure unique URL
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000/auth/callback?next=/auth/update-password`,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Verifique seu email para redefinir a senha.');
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <Button title={loading ? "Enviando..." : "Enviar Link"} onPress={handleReset} disabled={loading} />
      
      <Text style={styles.link} onPress={() => router.back()}>Voltar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { color: '#007AFF', fontSize: 16, marginTop: 20, textAlign: 'center' }
});
