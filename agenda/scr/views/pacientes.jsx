import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import app from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';

// Clase para la pantalla de Pacientes
export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const navigation = useNavigation();

  // Función para cargar los pacientes desde Firebase
  const cargarPacientes = () => {
    const db = getDatabase(app);
    const pacientesRef = ref(db, 'pacientes');
    
    get(pacientesRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Datos cargados:', data); // Verifica los datos aquí
          const pacientesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setPacientes(pacientesArray);
        } else {
          Alert.alert('No hay pacientes', 'Actualmente no hay pacientes registrados.');
        }
      })
      .catch(error => {
        console.error('Error al cargar los pacientes:', error);
        Alert.alert('Error', 'No se pudo cargar la lista de pacientes.');
      });
  };

  // Cargar pacientes cuando el componente se monta
  useEffect(() => {
    cargarPacientes();
  }, []);

  const navigateToNuevoPaciente = () => {
    navigation.navigate('Inicio', { screen: 'NuevoPaciente' });
  };

  const navigateToModificaPaciente = (paciente) => {
    navigation.navigate('Inicio', { screen: 'ModificaPaciente', params: { paciente } });
  };

  // Función para eliminar un paciente con confirmación
  const eliminarPaciente = (id) => {
    Alert.alert(
      "Eliminar paciente",
      "¿Estás seguro de que quieres eliminar a este paciente?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            const db = getDatabase(app);
            const pacienteRef = ref(db, `pacientes/${id}`);
            
            remove(pacienteRef)
              .then(() => {
                Alert.alert('Paciente eliminado', 'El paciente ha sido eliminado exitosamente.');
                setPacientes(pacientes.filter(paciente => paciente.id !== id));
              })
              .catch(error => {
                console.error('Error al eliminar el paciente:', error);
                Alert.alert('Error', 'No se pudo eliminar el paciente.');
              });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <Text style={styles.patientName}>{item.nombre || 'Nombre no disponible'}</Text>
      <Text>Diagnóstico: {item.diagnostico || 'No disponible'}</Text>
      <Text>Edad: {item.edad || 'No especificada'}</Text>
      <Text>Precio por terapia: ${item.precioPorTerapia || 'No disponible'}</Text>
      <Text>Resumen del tratamiento: {item.resumenTratamiento || 'No disponible'}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button}>
          <Button
            title="Modificar"
            onPress={() => navigateToModificaPaciente(item)}
            color="#4CAF50" // Color verde para el botón "Modificar"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Button
            title="Eliminar"
            onPress={() => eliminarPaciente(item.id)}
            color="#F44336" // Color rojo para el botón "Eliminar"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Button
            title="Nuevo Paciente"
            onPress={navigateToNuevoPaciente}
            color="#2196F3" // Color azul para el botón "Nuevo Paciente"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Button
            title="Actualizar"
            onPress={cargarPacientes} // Llama a la función de recargar pacientes
            color="#FF9800" // Color naranja para el botón "Actualizar"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pacientes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.patientList}
      />
    </View>
  );
}

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
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',  // Alineación horizontal de los botones
    justifyContent: 'space-between',  // Espacio entre botones
  },
  patientList: {
    width: '100%',
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 5, // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20, // Bordes redondeados para los botones
    overflow: 'hidden', // Asegura que el contenido del botón no sobresalga
    elevation: 3, // Sombra para un efecto elevado
  },
});
