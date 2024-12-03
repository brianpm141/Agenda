import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../utils/firebase';

const AgregarPaciente = () => {
  const [nombre, setNombre] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [edad, setEdad] = useState('');
  const [precioPorTerapia, setPrecioPorTerapia] = useState('');
  const [resumenTratamiento, setResumenTratamiento] = useState('');

  const handleAgregarPaciente = () => {
    if (!nombre || !diagnostico || !edad || !precioPorTerapia || !resumenTratamiento) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const db = getDatabase(app);
    const pacientesRef = ref(db, 'pacientes');

    const nuevoPaciente = {
      nombre,
      diagnostico,
      edad: parseInt(edad, 10),
      precioPorTerapia: parseFloat(precioPorTerapia),
      resumenTratamiento,
    };

    push(pacientesRef, nuevoPaciente)
      .then(() => {
        alert('Paciente agregado con éxito.');
        setNombre('');
        setDiagnostico('');
        setEdad('');
        setPrecioPorTerapia('');
        setResumenTratamiento('');
      })
      .catch(error => console.error('Error al agregar paciente:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Paciente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Diagnóstico"
        value={diagnostico}
        onChangeText={setDiagnostico}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Precio por Terapia"
        value={precioPorTerapia}
        onChangeText={setPrecioPorTerapia}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Resumen del Tratamiento"
        value={resumenTratamiento}
        onChangeText={setResumenTratamiento}
      />
      <Button title="Agregar Paciente" onPress={handleAgregarPaciente} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2a2a2a', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingLeft: 10, borderRadius: 5 },
});

export default AgregarPaciente;
