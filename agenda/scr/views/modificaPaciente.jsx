import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ModificaPaciente({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Paciente</Text>
      <Button 
        title="Guardar Cambios" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
