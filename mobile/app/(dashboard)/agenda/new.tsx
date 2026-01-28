import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function NewAppointment() {
  const router = useRouter();
  const [pacienteId, setPacienteId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [descricao, setDescricao] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: p } = await supabase.from('pacientes').select('id, nome').order('nome');
    if (p) setPacientes(p);

    const { data: m } = await supabase.from('profiles').select('id, full_name, role').eq('role', 'medico');
    if (m) setProfissionais(m);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dataHora;
    setShowDatePicker(Platform.OS === 'ios');
    setDataHora(currentDate);
    if (Platform.OS !== 'ios') setShowTimePicker(true);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dataHora;
    setShowTimePicker(Platform.OS === 'ios');
    setDataHora(currentDate);
  };

  const handleCreate = async () => {
    if (!pacienteId || !profissionalId || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user?.id).single();

    const { error } = await supabase.from('atendimentos').insert({
      clinica_id: profile?.clinica_id,
      paciente_id: pacienteId,
      profissional_id: profissionalId,
      data_hora: dataHora.toISOString(),
      descricao,
      status: 'agendado'
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Agendamento criado!');
      router.back();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>
      
      <Text style={styles.label}>Paciente *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={pacienteId} onValueChange={(itemValue) => setPacienteId(itemValue)}>
          <Picker.Item label="Selecione..." value="" />
          {pacientes.map(p => <Picker.Item key={p.id} label={p.nome} value={p.id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Profissional *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={profissionalId} onValueChange={(itemValue) => setProfissionalId(itemValue)}>
          <Picker.Item label="Selecione..." value="" />
          {profissionais.map(p => <Picker.Item key={p.id} label={p.full_name} value={p.id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Data e Hora *</Text>
      <Button title={dataHora.toLocaleString()} onPress={() => setShowDatePicker(true)} />
      
      {showDatePicker && (
        <DateTimePicker
          value={dataHora}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dataHora}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={[styles.label, { marginTop: 15 }]}>Descrição *</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Consulta de rotina" />
      
      <Button title={loading ? "Agendando..." : "Agendar"} onPress={handleCreate} disabled={loading} />
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
