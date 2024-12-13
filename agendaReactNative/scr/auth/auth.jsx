import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated, Text, TouchableOpacity } from "react-native";
import LogginForm from "./logginForm";
import RegisterForm from "./registerForm";
import { dynamicFontSizeMax, azulClaroPrincipal } from "../../styleColors";

export default function Auth() {
const [islog, setIslog] = useState(true);
const [isChecked, setIsChecked] = useState(true);

const fadeAnim = useState(new Animated.Value(1))[0];

const toggleSwitch = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setIslog(newCheckedState); // Sincroniza islog con el estado de isChecked
};

useEffect(() => {
    // Animación de opacidad para cambiar el texto
    Animated.sequence([
    Animated.timing(fadeAnim, {
        toValue: 0, // Desvanecer el texto actual
        duration: 300,
        useNativeDriver: true,
    }),
    Animated.timing(fadeAnim, {
        toValue: 1, // Mostrar el nuevo texto
        duration: 300,
        useNativeDriver: true,
    }),
    ]).start();
}, [islog]);

return (
    <View>
    <View style={styles.card}>
        <View style={styles.loader}>
        <Animated.Text style={[styles.word, { opacity: fadeAnim }]}>
            {islog ? "Ingresar" : "Regístrate"}
        </Animated.Text>
        </View>
    </View>
    {islog ? <LogginForm /> : <RegisterForm />}

    <View style={styles.container}>
        <TouchableOpacity onPress={toggleSwitch} style={styles.switchLabel}>
        <Text style={styles.text}>
            {isChecked ? "Registrarse" : "Iniciar sesión"}
        </Text>
        </TouchableOpacity>
    </View>
    </View>
);
}

const styles = StyleSheet.create({
card: {
    minWidth: "100%",
    marginTop: "10%",
    alignItems: "center",
    padding: 5,
    marginBottom: "5%",
},
loader: {
    alignItems: "center",
},
word: {
    fontSize: dynamicFontSizeMax,
    fontWeight: "bold",
    color: azulClaroPrincipal,
},
container: {
    alignItems: "center",
    maxHeight: "20%",
    minWidth: "100%",
},
switchLabel: {
    flexDirection: "row",
    alignItems: "center",
},
});
