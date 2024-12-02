import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";


const Sidebar = ({ navigation }) => {

    function singOut(){
        const auth = getAuth();
        signOut(auth).then(() => {
        }).catch((error) => {
        });
        }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
        <Text style={styles.link}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Citas")}>
        <Text style={styles.link}>Citas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Pacientes")}>
        <Text style={styles.link}>Pacientes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress= {singOut} >
        <Text style={styles.link}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  link: {
    fontSize: 18,
    marginVertical: 10,
    color: "#007AFF",
  },
});

export default Sidebar;
