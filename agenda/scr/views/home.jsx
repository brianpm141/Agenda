import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Agenda } from "react-native-calendars";
import {
  amarilloLigero,
  verdePesado,
  azulMarinoPesado,
  dynamicFontSizeMinimal,
  rojo,
  verde,
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
    if (!pacientes || Object.keys(pacientes).length === 0) return;
    const citasRef = ref(db, "citas");
    onValue(citasRef, (snapshot) => {
      const data = snapshot.val();
      const formattedItems = {};
      const today = new Date();
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      for (let d = new Date(); d <= endDate; d.setDate(d.getDate() + 1)) {
        const date = d.toISOString().split("T")[0];
        formattedItems[date] = [];
      }

      for (const key in data) {
        const { fecha, hora, idPaciente, atendido } = data[key];
        if (!formattedItems[fecha]) {
          formattedItems[fecha] = [];
        }
        formattedItems[fecha].push({
          name: `Paciente: ${pacientes[idPaciente]?.nombre || "Desconocido"}`,
          time: hora,
          height: 50,
          estado: atendido,
          cita: { ...data[key], id: key },
        });
      }

      setItems(formattedItems);
    });
  }, [pacientes]);

  const handleNuevaCita = (day) => {
    navigation.navigate("NuevaCita", {
      selectedDay: day.toISOString().split("T")[0],
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

  const handleDayPress = (day) => {
    const formattedItems = {};
    const today = new Date(day.dateString);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    for (let d = today; d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split("T")[0];
      if (!items[date]) {
        formattedItems[date] = [];
      }
    }
    setItems((prevItems) => ({
      ...prevItems,
      ...formattedItems,
    }));
  };
  return (
    <Agenda
      items={items}
      selected={new Date().toISOString().split("T")[0]}
      renderItem={(item) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleModificarCita(item)}
        >
          <Text style={styles.itemTextHora}>{item.time}</Text>
          <Text style={styles.itemTextPaciente}>{item.name}</Text>
          <Text
            style={styles.itemTextatendido}
            backgroundColor={item.estado ? verde : rojo}
          >
            {item.estado ? "Atendido" : "No atendido"}
          </Text>
        </TouchableOpacity>
      )}
      renderEmptyDate={(day) => renderEmptyDate(day)}
      showClosingKnob={true}
      onDayPress={(day) => handleDayPress(day)}
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
    paddingBottom: 10,
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
  itemTextatendido: {
    maxWidth: "25%",
    borderRadius: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
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
