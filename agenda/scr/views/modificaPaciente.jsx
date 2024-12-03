import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import app from '../utils/firebase';

const ModificaPaciente = ({ route, navigation }) => {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente.nombre);
  const [diagnostico, setDiagnostico] = useState(paciente.diagnostico);
  const [edad, setEdad] = useState(paciente.edad.toString());
  const [precioPorTerapia, setPrecioPorTerapia] = useState(paciente.precioPorTerapia.toString());
  const [resumenTratamiento, setResumenTratamiento] = useState(paciente.resumenTratamiento);

  const handleSaveEdit = () => {
    if (!nombre || !diagnostico || !edad || !precioPorTerapia || !resumenTratamiento) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const db = getDatabase(app);
    const pacienteRef = ref(db, `pacientes/${paciente.id}`);

    update(pacienteRef, { nombre, diagnostico, edad: parseInt(edad), precioPorTerapia: parseFloat(precioPorTerapia), resumenTratamiento })
      .then(() => {
        alert('Paciente actualizado con éxito.');
        navigation.goBack();
      })
      .catch(error => console.error('Error al actualizar paciente:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Paciente</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Diagnóstico" value={diagnostico} onChangeText={setDiagnostico} />
      <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Precio por Terapia" value={precioPorTerapia} onChangeText={setPrecioPorTerapia} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Resumen del Tratamiento" value={resumenTratamiento} onChangeText={setResumenTratamiento} />
      <Button title="Guardar Cambios" onPress={handleSaveEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2a2a2a', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingLeft: 10, borderRadius: 5 },
});

export default ModificaPaciente;
