import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  azulCieloPrincipal,
  azulMarinoPesado,
  background,
  dynamicFontSizeMinimal,
  dynamicFontSizeOption,
  verde,
} from "../../styleColors";
import { useNavigation } from "@react-navigation/native";

export default function Citas() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [siguientesCitas, setSiguientesCitas] = useState([]);
  const [pacientes, setPacientes] = useState({});

  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  useEffect(() => {
    const db = getDatabase();

    const pacientesRef = ref(db, "pacientes");
    onValue(pacientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPacientes(data);
      } else {
        setPacientes({});
      }
    });

    const citasRef = ref(db, "citas");
    onValue(citasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const citasArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const currentDate = new Date();

        // Ordenar citas por fecha y hora
        citasArray.sort((a, b) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);

          if (fechaA - fechaB !== 0) {
            return fechaA - fechaB; // Ordenar por fecha
          }

          const horaA = a.hora.split(":").map(Number);
          const horaB = b.hora.split(":").map(Number);

          return horaA[0] - horaB[0] || horaA[1] - horaB[1]; // Ordenar por hora
        });

        const citasHoy = citasArray.filter(
          (cita) => cita.fecha === date.toLocaleDateString("en-CA")
        );

        const citasFuturas = citasArray.filter((cita) => {
          const citaFecha = new Date(cita.fecha);
          return citaFecha > currentDate;
        });

        setCitasDelDia(citasHoy);
        setSiguientesCitas(citasFuturas);
      } else {
        setCitasDelDia([]);
        setSiguientesCitas([]);
      }
    });
  }, [date]);

  const handleNuevaCita = () => {
    navigation.navigate("Inicio", { screen: "NuevaCita" });
  };

  const handleModificaCita = (cita) => {
    navigation.navigate("Inicio", {
      screen: "ModificaCita",
      params: { cita },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.labels}>
          <Text style={styles.label}>Buscar Fecha:</Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.pickerText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nuevaCitaButton}
            onPress={handleNuevaCita}
          >
            <Text style={styles.nuevaCitaText}>Nueva cita</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View style={styles.citasfechaCont}>
        <Text style={styles.label}>
          Citas del día: <Text style={styles.fechaText}>{date.toLocaleDateString()}</Text>
        </Text>

        <FlatList
          data={citasDelDia}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.citaItem}>Ninguna cita en este día</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.citaItem}
              onPress={() => handleModificaCita(item)}
            >
              <Text style={styles.citaText}>Hora: {item.hora}</Text>
              <Text style={styles.citaText}>
                Paciente: {pacientes[item.idPaciente]?.nombre || "Desconocido"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.citasCont}>
        <Text style={styles.label}>Siguientes citas:</Text>

        <FlatList
          data={siguientesCitas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.citaItem}
              onPress={() => handleModificaCita(item)}
            >
              <Text style={styles.citaText}>Fecha: {item.fecha}</Text>
              <Text style={styles.citaText}>Hora: {item.hora}</Text>
              <Text style={styles.citaText}>
                Paciente: {pacientes[item.idPaciente]?.nombre || "Desconocido"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: "center",
  },
  head: {
    height: "15%",
    width: "85%",
    justifyContent: "center",
    backgroundColor: azulCieloPrincipal,
    borderRadius: 15,
    marginTop: "5%",
    padding: "5%",
    borderColor: azulMarinoPesado,
    borderWidth: 1,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "center",
  },
  label: {
    fontSize: dynamicFontSizeOption,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    marginTop: "3%",
    minWidth: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "80%",
  },
  pickerButton: {
    padding: "2%",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "65%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: dynamicFontSizeOption,
    textAlign: "center",
    color: "#333",
  },
  nuevaCitaButton: {
    padding: "2%",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: verde,
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  nuevaCitaText: {
    fontSize: dynamicFontSizeMinimal,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  citasfechaCont: {
    backgroundColor: azulCieloPrincipal,
    marginTop: "5%",
    padding: "5%",
    width: "85%",
    minHeight: "15%",
    maxHeight: "30%",
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  citasCont: {
    flex: 1,
    backgroundColor: azulCieloPrincipal,
    marginTop: "5%",
    padding: "5%",
    width: "85%",
    maxHeight: "55%",
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%",
  },
  fechaText: {
    fontWeight: "bold",
    fontSize: dynamicFontSizeOption,
    color: azulMarinoPesado,
  },
  emptyText: {
    fontSize: dynamicFontSizeOption,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  citaItem: {
    marginTop: "5%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  citaText: {
    fontSize: dynamicFontSizeMinimal,
    color: "#333",
  },
});
