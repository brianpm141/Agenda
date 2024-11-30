import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import app from '../utils/firebase';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    
    const db = getDatabase(app); 
    const pacientesRef = ref(db, 'pacientes');
    
    get(pacientesRef).then(snapshot => {
      if (snapshot.exists()) {
        setPacientes(Object.values(snapshot.val()));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error getting data: ", error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
      {pacientes.length === 0 ? (
        <Text style={styles.noPatientsText}>No hay pacientes registrados.</Text>
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.patientItem}>
              <Text style={styles.patientName}>{item.nombre}</Text>
              <Text style={styles.patientDetails}>Diagnóstico: {item.diagnostico}</Text>
              <Text style={styles.patientDetails}>Edad: {item.edad} años</Text>
              <Text style={styles.patientDetails}>Precio por Terapia: ${item.precioPorTerapia}</Text>
              <Text style={styles.patientDetails}>Tratamiento: {item.resumenTratamiento}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 20,
    textAlign: 'center',
  },
  noPatientsText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  patientItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  patientDetails: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});

export default Pacientes;
