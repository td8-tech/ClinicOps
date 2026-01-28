import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Picker } from '@react-native-picker/picker';

// Mask Helpers
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

export default function NewPatient() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'medico');
    if (data) setMedicos(data);
  };

  const handleCreate = async () => {
    if (!nome || !medicoId) {
      Alert.alert('Erro', 'Nome e Médico são obrigatórios');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user?.id).single();

    const { error } = await supabase.from('pacientes').insert({
      clinica_id: profile?.clinica_id,
      medico_id: medicoId,
      nome,
      cpf,
      telefone
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Paciente cadastrado!');
      router.back();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Paciente</Text>
      
      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Médico Responsável *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicoId}
          onValueChange={(itemValue) => setMedicoId(itemValue)}
        >
          <Picker.Item label="Selecione um médico" value="" />
          {medicos.map(m => (
            <Picker.Item key={m.id} label={m.full_name} value={m.id} />
          ))}
        </Picker>
      </View>

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
      
      <Button title={loading ? "Salvando..." : "Salvar"} onPress={handleCreate} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  label: { marginBottom: 5, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 }
});
