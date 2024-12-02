import React, { useState, useEffect } from "react";
import { Image, SafeAreaView, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./scr/utils/firebaseConfig"; // Configuración de Firebase
import Home from "./scr/views/home";
import Citas from "./scr/views/citas";
import Pacientes from "./scr/views/pacientes";
import { background } from "./styleColors";
import Auth from "./scr/auth/auth";
import NuevaCita from "./scr/views/nuevaCita";
import ModificaCita from "./scr/views/modificaCita";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Crear Stack Navigator

// Configurar Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Rutas para la navegación entre pestañas
function InternalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inicio"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NuevaCita"
        component={NuevaCita}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ModificaCita"
        component={ModificaCita}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Rutas de la barra de navegación
function RootStack() {
  return (
    <Tab.Navigator initialRouteName="Inicio">
      <Tab.Screen
        name="Citas"
        component={Citas}
        options={{
          tabBarIcon: ({ size }) => (
            <Image
              source={require("./assets/icons/cita.png")}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Inicio"
        component={InternalStack}
        options={{
          tabBarIcon: ({ size }) => (
            <Image
              source={require("./assets/icons/calendario.png")}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pacientes"
        component={Pacientes}
        options={{
          tabBarIcon: ({ size }) => (
            <Image
              source={require("./assets/icons/pas.png")}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null); // Usuario autenticado
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Finaliza la verificación del estado
    });

    // Limpia el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Muestra un indicador de carga mientras verifica la sesión
    return (
      <SafeAreaView style={[styles.background, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    // Usuario no autenticado: muestra el componente de autenticación
    return (
      <SafeAreaView style={styles.background}>
        <Auth />
      </SafeAreaView>
    );
  }

  // Usuario autenticado: muestra la navegación principal
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: background,
    paddingVertical: "5%",
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
