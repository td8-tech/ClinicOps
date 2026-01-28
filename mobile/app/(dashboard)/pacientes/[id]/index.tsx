import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

// Simple Mask Functions
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export default function EditPatient() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    const { data, error } = await supabase.from('pacientes').select('*').eq('id', id).single();
    if (error) {
      Alert.alert('Erro', 'Paciente não encontrado');
      router.back();
      return;
    }
    setNome(data.nome);
    setCpf(data.cpf || '');
    setTelefone(data.telefone || '');
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('pacientes').update({
      nome,
      cpf,
      telefone
    }).eq('id', id);

    setSaving(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Paciente atualizado!');
      router.back();
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Paciente</Text>
      
      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>CPF</Text>
      <TextInput 
        style={styles.input} 
        value={cpf} 
        onChangeText={(t) => setCpf(maskCPF(t))} 
        keyboardType="numeric"
        maxLength={14}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput 
        style={styles.input} 
        value={telefone} 
        onChangeText={(t) => setTelefone(maskPhone(t))} 
        keyboardType="phone-pad"
        maxLength={15}
      />
      
      <Button title={saving ? "Salvando..." : "Salvar Alterações"} onPress={handleUpdate} disabled={saving} />
      <View style={{ height: 10 }} />
      <Button title="Cancelar" color="#ff3b30" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  label: { marginBottom: 5, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
