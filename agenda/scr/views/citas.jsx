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
  dynamicFontSizeText,
  verde,
} from "../../styleColors";

export default function Citas() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState({});

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

        const filteredCitas = citasArray.filter(
          (cita) => cita.fecha === date.toLocaleDateString("en-CA")
        );

        setCitas(filteredCitas);
      } else {
        setCitas([]);
      }
    });
  }, [date]);

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
          data={citas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.citaItem}>
              <Text style={styles.citaText}>Hora: {item.hora}</Text>
              <Text style={styles.citaText}>
                Paciente: {pacientes[item.idPaciente]?.nombre || "Desconocido"}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.citasfechaCont}>
        <Text style={styles.label}>
          Siguientes citas
        </Text>

        <FlatList
          data={citas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.citaItem}>
              <Text style={styles.citaText}>Hora: {item.hora}</Text>
              <Text style={styles.citaText}>
                Paciente: {pacientes[item.idPaciente]?.nombre || "Desconocido"}
              </Text>
            </View>
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
    height: "20%",
    minWidth: "80%",
    maxWidth: "80%",
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
    fontSize: dynamicFontSizeText,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    marginTop: "3%",
    minWidth: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: "70%",
  },
  pickerButton: {
    marginRight: "2%",
    padding: "5%",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "60%",
    height: "80%",
  },
  pickerText: {
    fontSize: dynamicFontSizeOption,
    color: "#333",
  },
  citasfechaCont: {
    backgroundColor: azulCieloPrincipal,
    marginTop: "5%",
    padding: "5%",
    width: "80%",
    height : '35%',
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fechaText: {
    fontWeight: "bold",
    fontSize: dynamicFontSizeOption,
    color: azulMarinoPesado,
  },
  citaItem: {
    marginTop: '5%',
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
