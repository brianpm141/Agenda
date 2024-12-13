import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { validateEmail } from "../utils/validation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { dynamicFontSize ,dynamicFontSizeOption, azulClaroPrincipal } from "../../styleColors";


export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const Register = () => {
        if ((email && password) === "" ){
            setError("Ingresa correo y contraseña para continuar")
        } else if (!validateEmail(email)) {
            setError("El correo electrónico no es válido");
        } else if (password.length < 8 || password.length > 16) {
            setError("La contraseña debe tener entre 8 y 16 caracteres");
        } else if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
        } else {
            const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }
    };

    return (
        <View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirma Contraseña"
                    secureTextEntry={true}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                />

                {error ? (
                    <Text style = {styles.errorText} >{error}</Text>
                ) : null}

            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={Register}>
                    <Text style={styles.buttonText}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
            marginBottom: '5%',
            alignItems: 'center',
            minHeight : '65%',
            maxHeight: '65%',
            minWidth: '100%',
        },
            input: {
            backgroundColor: '#eee',
            borderRadius: 10, 
            padding: 5, 
            fontSize: dynamicFontSize, 
            width: '80%', 
            height: '20%',
            color: 'lightcoral',
            margin : '2%'
        },
            errorText: {
            borderWidth : 3,
            borderRadius: 10, 
            padding: 5,
            fontSize: dynamicFontSize, 
            width: '80%', 
            height: '20%',
            margin : '2%'
        },
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderColor: azulClaroPrincipal,
            borderWidth: 2,
            borderRadius: 5,
            width: '60%',
        },
            buttonText: {
            fontSize: dynamicFontSizeOption,
            fontWeight: '600',
            color: azulClaroPrincipal,
        },
        container: {
            alignItems: 'center',
            maxHeight: '20%',
            minWidth : '100%',
            alignItems: 'center',
        },
})