import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Agenda } from "react-native-calendars";
import {
  amarilloLigero,
  verdePesado,
  azulMarinoPesado,
  dynamicFontSizeMinimal,
} from "../../styleColors";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [pacientes, setPacientes] = useState({});
  const [items, setItems] = useState({});
  const db = getDatabase();

  const navigation = useNavigation();

  useEffect(() => {
    const pacientesRef = ref(db, "pacientes");
    onValue(pacientesRef, (snapshot) => {
      const data = snapshot.val();
      setPacientes(data || {});
    });
  }, []);

  useEffect(() => {
    const citasRef = ref(db, "citas");
    onValue(citasRef, (snapshot) => {
      const data = snapshot.val();
      const formattedItems = {};
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getDay() - 15, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const date = d.toISOString().split("T")[0];
        formattedItems[date] = [];
      }
      // Transformar datos en el formato necesario para Agenda
      for (const key in data) {
        const { fecha, hora, idPaciente } = data[key];
        if (!formattedItems[fecha]) {
          formattedItems[fecha] = [];
        }
        formattedItems[fecha].push({
          name: `Paciente: ${pacientes[idPaciente]?.nombre || "Desconocido"}`,
          time: hora,
          height: 50,
          cita: { ...data[key], id: key },
        });
      }

      setItems(formattedItems);
    });
  }, [pacientes]);

  const handleNuevaCita = (day) => {
    navigation.navigate("NuevaCita", {
      selectedDay: day.toLocaleDateString("en-CA"),
    });
  };

  const renderEmptyDate = (day) => {
    return (
      <View style={styles.emptyDate}>
        <TouchableOpacity
          style={styles.nuevaCitaButton}
          onPress={() => handleNuevaCita(day)}
        >
          <Text style={styles.nuevaCitaText}>Sin citas pendientes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleModificarCita = (item) => {
    navigation.navigate("ModificaCita", { cita: item.cita });
  };

  return (
    <Agenda
      items={items}
      selected={new Date().toISOString().split("T")[0]} // Fecha de hoy en formato YYYY-MM-DD
      renderItem={(item) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleModificarCita(item)}
        >
          <Text style={styles.itemTextHora}>{item.time}</Text>
          <Text style={styles.itemTextPaciente}>{item.name}</Text>
        </TouchableOpacity>
      )}
      renderEmptyDate={(day) => renderEmptyDate(day)}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: amarilloLigero,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemTextHora: {
    color: verdePesado,
    fontSize: 16,
  },
  itemTextPaciente: {
    color: azulMarinoPesado,
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    marginTop: 30,
  },
  nuevaCitaButton: {
    width: "30%",
    height: "100%",
  },
  nuevaCitaText: {
    fontSize: dynamicFontSizeMinimal,
    color: "#333",
    fontWeight: "bold",
  },
});
