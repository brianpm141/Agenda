import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, update, get } from 'firebase/database';
import app from '../utils/firebase';

const ModificaPaciente = ({ route, navigation }) => {
  const { paciente } = route.params || {};  // Desestructuración con valor por defecto

  if (!paciente) {
    Alert.alert('Error', 'No se pudo cargar la información del paciente.');
    return null;
  }

  const [nombre, setNombre] = useState(paciente.nombre || '');
  const [diagnostico, setDiagnostico] = useState(paciente.diagnostico || '');
  const [edad, setEdad] = useState(paciente.edad ? paciente.edad.toString() : '');
  const [precioPorTerapia, setPrecioPorTerapia] = useState(paciente.precioPorTerapia ? paciente.precioPorTerapia.toString() : '');
  const [resumenTratamiento, setResumenTratamiento] = useState(paciente.resumenTratamiento || '');

  useEffect(() => {
    if (!paciente || !paciente.id) {
      Alert.alert('Error', 'No se pudo cargar la información del paciente.');
      return;
    }

    const db = getDatabase(app);
    const pacienteRef = ref(db, `pacientes/${paciente.id}`);
    get(pacienteRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNombre(data.nombre);
          setDiagnostico(data.diagnostico);
          setEdad(data.edad.toString());
          setPrecioPorTerapia(data.precioPorTerapia.toString());
          setResumenTratamiento(data.resumenTratamiento);
        } else {
          Alert.alert('Error', 'No se encontró el paciente en la base de datos.');
        }
      })
      .catch(error => {
        console.error('Error al cargar el paciente:', error);
        Alert.alert('Error', 'No se pudo cargar la información del paciente.');
      });
  }, [paciente]);

  const handleSaveEdit = () => {
    if (!nombre || !diagnostico || !edad || !precioPorTerapia || !resumenTratamiento) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const db = getDatabase(app);
    const pacienteRef = ref(db, `pacientes/${paciente.id}`);

    update(pacienteRef, {
      nombre,
      diagnostico,
      edad: parseInt(edad),
      precioPorTerapia: parseFloat(precioPorTerapia),
      resumenTratamiento,
    })
      .then(() => {
        Alert.alert('Éxito', 'Paciente actualizado con éxito.');
        navigation.navigate('Pacientes'); // Cambié esto para navegar a la pantalla de pacientes
      })
      .catch(error => {
        console.error('Error al actualizar paciente:', error);
        Alert.alert('Error', 'No se pudo actualizar el paciente.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Paciente</Text>
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
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',  // Alineación horizontal de los botones
    justifyContent: 'space-between',  // Espacio entre botones
  },
  saveButton: {
    backgroundColor: '#4CAF50',  // Verde para el botón de guardar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,  // Bordes redondeados
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',  // Azul para el botón de regresar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,  // Bordes redondeados
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModificaPaciente;
