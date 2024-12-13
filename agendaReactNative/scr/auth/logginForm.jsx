import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { dynamicFontSize ,dynamicFontSizeOption, azulMarinoLigero, azulMarinoPesado, azulClaroPrincipal } from "../../styleColors";

export default function LogginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const Loggin = () => {
    if (email === "" || password === "") {
        setError("Ingresa correo y contraseña para continuar");
    } else {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setError(""); 
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
            setError("Correo o contraseña incorrectos");
            } else {
            setError("Correo o contraseña incorrectos");
            }
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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={Loggin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
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