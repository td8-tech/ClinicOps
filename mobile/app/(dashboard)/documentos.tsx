import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Picker } from '@react-native-picker/picker';

export default function DocumentosScreen() {
  const [pacienteId, setPacienteId] = useState('');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [uploading, setLoading] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetchPacientes();
    fetchDocs();
  }, []);

  const fetchPacientes = async () => {
    const { data } = await supabase.from('pacientes').select('id, nome');
    if (data) setPacientes(data);
  };

  const fetchDocs = async () => {
    // Only fetch docs if allowed (RLS will handle security, but we can prevent UI error)
    const { data, error } = await supabase.from('documentos').select('*, pacientes(nome)');
    if (!error) setDocs(data || []);
  };

  const pickDocument = async () => {
    if (!pacienteId) {
      Alert.alert('Erro', 'Selecione um paciente primeiro');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      uploadFile(file);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async (file: any) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user?.id).single();

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.clinica_id}/${Date.now()}.${fileExt}`;

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any);

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, formData, { contentType: file.mimeType });

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: dbError } = await supabase.from('documentos').insert({
        clinica_id: profile?.clinica_id,
        paciente_id: pacienteId,
        nome_arquivo: file.name,
        url: fileName,
        tipo: file.mimeType
      });

      if (dbError) throw dbError;

      Alert.alert('Sucesso', 'Arquivo enviado!');
      fetchDocs();
    } catch (error: any) {
      Alert.alert('Erro no upload', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Documentos</Text>
      
      <View style={styles.uploadSection}>
        <Text style={styles.label}>Novo Upload</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pacienteId}
            onValueChange={(itemValue) => setPacienteId(itemValue)}
          >
            <Picker.Item label="Selecione Paciente" value="" />
            {pacientes.map(p => <Picker.Item key={p.id} label={p.nome} value={p.id} />)}
          </Picker>
        </View>
        <Button title={uploading ? "Enviando..." : "Selecionar Arquivo"} onPress={pickDocument} disabled={uploading} />
      </View>

      <ScrollView style={styles.list}>
        <Text style={styles.listTitle}>Arquivos Recentes</Text>
        {docs.map((doc) => (
          <View key={doc.id} style={styles.card}>
            <Text style={styles.fileName}>{doc.nome_arquivo}</Text>
            <Text style={styles.fileDetail}>Paciente: {doc.pacientes?.nome}</Text>
          </View>
        ))}
        {docs.length === 0 && <Text style={styles.empty}>Nenhum documento.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  uploadSection: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20 },
  label: { marginBottom: 10, fontWeight: '600' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  list: { flex: 1 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10 },
  fileName: { fontWeight: '600' },
  fileDetail: { color: '#666', fontSize: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 }
});
