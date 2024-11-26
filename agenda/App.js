import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './scr/views/home';
import Citas from './scr/views/citas';
import Pacientes from './scr/views/pacientes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Crear Stack Navigator

// Rutas para la navegacion entre pestañas 
function InternalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Inicio" 
        component={Home} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

// Rutas de la barra de navegacion 
function RootStack() {
  return (
    <Tab.Navigator initialRouteName="Inicio">
      <Tab.Screen 
        name="Citas" 
        component={Citas}   
      />
      <Tab.Screen 
        name="Inicio" 
        component={InternalStack} // Cambiar a InternalStack
      />
      <Tab.Screen 
        name="Pacientes" 
        component={Pacientes} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer style={styles.general}>
        <RootStack />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
