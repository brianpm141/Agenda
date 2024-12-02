import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database';
import app from '../utils/firebase';

const Tab = createMaterialTopTabNavigator();

const MostrarPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const fetchPacientes = () => {
    const db = getDatabase(app);
    const pacientesRef = ref(db, 'pacientes');

    get(pacientesRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const pacientesArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
          setPacientes(pacientesArray);
        } else {
          console.log('No hay datos disponibles.');
        }
      })
      .catch(error => console.error('Error al obtener datos:', error));
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleDeletePaciente = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const db = getDatabase(app);
            const pacienteRef = ref(db, `pacientes/${id}`);

            remove(pacienteRef)
              .then(() => {
                alert('Paciente eliminado con éxito.');
                fetchPacientes();
              })
              .catch(error => console.error('Error al eliminar paciente:', error));
          },
        },
      ]
    );
  };

  const handleEditPaciente = (paciente) => {
    setEditing(true);
    setSelectedPaciente(paciente);
  };

  const handleSaveEdit = () => {
    const { id, nombre, diagnostico, edad, precioPorTerapia, resumenTratamiento } = selectedPaciente;

    if (!nombre || !diagnostico || !edad || !precioPorTerapia || !resumenTratamiento) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const db = getDatabase(app);
    const pacienteRef = ref(db, `pacientes/${id}`);

    update(pacienteRef, { nombre, diagnostico, edad, precioPorTerapia, resumenTratamiento })
      .then(() => {
        alert('Paciente actualizado con éxito.');
        setEditing(false);
        setSelectedPaciente(null);
        fetchPacientes();
      })
      .catch(error => console.error('Error al actualizar paciente:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mostrar Pacientes</Text>
      {pacientes.length === 0 ? (
        <Text style={styles.noPatientsText}>No hay pacientes registrados.</Text>
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.patientItem}>
              <Text style={styles.patientName}>{item.nombre}</Text>
              <Text style={styles.patientDetails}>Diagnóstico: {item.diagnostico}</Text>
              <Text style={styles.patientDetails}>Edad: {item.edad} años</Text>
              <Text style={styles.patientDetails}>Precio por Terapia: ${item.precioPorTerapia}</Text>
              <Text style={styles.patientDetails}>Tratamiento: {item.resumenTratamiento}</Text>

              {/* Botones */}
              <View style={styles.actionButtons}>
                <Button title="Eliminar" color="red" onPress={() => handleDeletePaciente(item.id)} />
                <Button title="Modificar" onPress={() => handleEditPaciente(item)} />
              </View>
            </View>
          )}
        />
      )}

      {/* Formulario de edición */}
      {editing && (
        <View>
          <Text style={styles.title}>Editar Paciente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={selectedPaciente?.nombre || ''}
            onChangeText={(text) => setSelectedPaciente({ ...selectedPaciente, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Diagnóstico"
            value={selectedPaciente?.diagnostico || ''}
            onChangeText={(text) => setSelectedPaciente({ ...selectedPaciente, diagnostico: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={selectedPaciente?.edad?.toString() || ''}
            onChangeText={(text) => setSelectedPaciente({ ...selectedPaciente, edad: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Precio por Terapia"
            value={selectedPaciente?.precioPorTerapia?.toString() || ''}
            onChangeText={(text) => setSelectedPaciente({ ...selectedPaciente, precioPorTerapia: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Resumen del Tratamiento"
            value={selectedPaciente?.resumenTratamiento || ''}
            onChangeText={(text) => setSelectedPaciente({ ...selectedPaciente, resumenTratamiento: text })}
          />
          <Button title="Guardar Cambios" onPress={handleSaveEdit} />
          <Button title="Cancelar" color="gray" onPress={() => setEditing(false)} />
        </View>
      )}

      {/* Botón para actualizar la lista */}
      <Button title="Actualizar Pacientes" onPress={fetchPacientes} />
    </View>
  );
};

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


// Navegador de pestañas
const PacientesTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Mostrar Pacientes" component={MostrarPacientes} />
      <Tab.Screen name="Agregar Paciente" component={AgregarPaciente} />
    </Tab.Navigator>
  );
};

export default PacientesTabs;

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2a2a2a', marginBottom: 20, textAlign: 'center' },
  noPatientsText: { fontSize: 18, color: '#777', textAlign: 'center', marginTop: 20 },
  patientItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 5 },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  patientDetails: { fontSize: 16, color: '#555', marginTop: 5 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingLeft: 10, borderRadius: 5 },
});
