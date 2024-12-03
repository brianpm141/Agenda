
import React, { useState, useEffect } from "react";
import { Image, SafeAreaView, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Importar Drawer Navigator
import { initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "./scr/utils/firebaseConfig";
import Home from "./scr/views/home";
import Citas from "./scr/views/citas";
import Pacientes from "./scr/views/pacientes";
import NuevaCita from "./scr/views/nuevaCita";
import ModificaCita from "./scr/views/modificaCita";
import Sidebar from "./Sidebar";
import Auth from "./scr/auth/auth";
import { background } from "./styleColors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator(); // Crear Drawer Navigator

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
        name="NuevoPaciente" 
        component={NuevoPaciente} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ModificaPaciente" 
        component={ModificaPaciente} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

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
          headerShown :false,
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
          headerShown :false
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
          headerShown :false
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.background, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.background}>
        <Auth />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{ drawerPosition: "left" }}
      >
        <Drawer.Screen
    name="Principal"
    component={RootStack}
    options={{ headerTitle: "AgendaFisio" }}
  />
      </Drawer.Navigator>
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
