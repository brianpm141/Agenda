import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Clase para la pantalla de Pacientes
export default function Pacientes() {
  const navigation = useNavigation();

  const navigateToNuevoPaciente = () => {
    navigation.navigate("Inicio", {
      screen: "NuevoPaciente",
    });
  };

  const navigateToModificaPaciente = () => {
    navigation.navigate("Inicio", {
      screen: "ModificaPaciente"});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
      
      <Button
        title="Nuevo Paciente"
        onPress={navigateToNuevoPaciente}
      />
      <Button
        title="Modificar Paciente"
        onPress={navigateToModificaPaciente}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
