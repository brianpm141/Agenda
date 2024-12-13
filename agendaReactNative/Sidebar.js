import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { azulClaroPrincipal, azulMarinoLigero, azulMarinoPesado, dynamicFontSizeTitle, naranjaPesado, naranjaPrincipal } from "./styleColors";

const Sidebar = ({ navigation }) => {
  function singOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Manejo después de cerrar sesión
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style= {styles.buttonBox} onPress={() => navigation.navigate("Principal", { screen: "Inicio" })}>
        <Text style={styles.link}>Calendario</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.buttonBox} onPress={() => navigation.navigate("Principal", { screen: "Citas" })}>
        <Text style={styles.link}>Citas</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.buttonBox} onPress={() => navigation.navigate("Principal", { screen: "Pacientes" })}>
        <Text style={styles.link}>Pacientes</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.buttonBoxOut} onPress={singOut}>
        <Text style={styles.linkOut}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: '5%',
    marginTop : '10%',
    alignContent: 'center'
  },
  buttonBox:{
    backgroundColor : azulClaroPrincipal,
    marginTop : '10%',
    borderRadius: 15,
    height: '10%',
    width : '95%',
    borderWidth: 1,
    borderColor: azulMarinoPesado
  },
  buttonBoxOut:{
    backgroundColor : naranjaPrincipal,
    marginTop : '10%',
    borderRadius: 15,
    height: '10%',
    width : '95%',
    borderWidth: 1,
    borderColor: azulMarinoPesado,
    position: 'absolute',
    bottom : '5%',
    left: '5%',
    right: '5%'
  },
  link: {
    fontSize: dynamicFontSizeTitle,
    padding: '5%',
    color: "090909",
    textAlign: 'center'
  },
  linkOut: {
    fontSize: dynamicFontSizeTitle,
    padding: '5%',
    color: "#090909",
    textAlign: 'center'
  },
});

export default Sidebar;
