import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../utils/firebase';

const AgregarPaciente = ({ navigation }) => {
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
      
      {/* Botón de agregar paciente con estilo verde */}
      <TouchableOpacity style={styles.addButton} onPress={handleAgregarPaciente}>
        <Text style={styles.buttonText}>Agregar Paciente</Text>
      </TouchableOpacity>

      {/* Botón para regresar con estilo azul */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Pacientes')}>
          <Text style={styles.buttonText}>Regresar a Pacientes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',  // Verde
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,  // Bordes redondeados
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#2196F3',  // Azul
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,  // Bordes redondeados
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default AgregarPaciente;
