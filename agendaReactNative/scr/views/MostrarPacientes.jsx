import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import app from '../utils/firebase';

const MostrarPacientes = () => {
  const [pacientes, setPacientes] = useState([]);

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
              <Button title="Eliminar" color="red" onPress={() => handleDeletePaciente(item.id)} />
            </View>
          )}
        />
      )}
      <Button title="Actualizar Pacientes" onPress={fetchPacientes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2a2a2a', marginBottom: 20, textAlign: 'center' },
  noPatientsText: { fontSize: 18, color: '#777', textAlign: 'center', marginTop: 20 },
  patientItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 5 },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  patientDetails: { fontSize: 16, color: '#555', marginTop: 5 },
});

export default MostrarPacientes;
