import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  dynamicFontSizeOption,
  dynamicFontSize,
  azulClaroPrincipal,
  dynamicFontSizeTitle,
  background,
  azulMarinoPesado,
  rojo,
  verde,
} from "../../styleColors";

export default function NuevaCita() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [pacienteId, setPacienteId] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const pacientesRef = ref(db, "pacientes");

    onValue(pacientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pacientesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          nombre: value.nombre,
        }));
        setPacientes(pacientesArray);
      }
    });
  }, []);

  const handleAddCita = () => {
    if (!date) {
      Alert.alert("Error", "Por favor selecciona una fecha.");
      return;
    }
    if (!time) {
      Alert.alert("Error", "Por favor selecciona una hora.");
      return;
    }
    if (!pacienteId) {
      Alert.alert("Error", "Por favor selecciona un paciente.");
      return;
    }

    const db = getDatabase();
    const citasRef = ref(db, "citas");

    push(citasRef, {
      fecha: date,
      hora: time,
      idPaciente: pacienteId,
    })
      .then(() => {
        Alert.alert("Cita añadida", "La cita fue registrada exitosamente.");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleAddPaciente = () => {

  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toLocaleDateString("en-CA"));
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      setTime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Nueva Cita</Text>

      <TouchableOpacity style={styles.picker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.pickerText}>{date || "Seleccionar fecha"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity style={styles.picker} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.pickerText}>{time || "Seleccionar hora"}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <View style={styles.pacienteRow}>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={pacienteId}
            onValueChange={(itemValue) => setPacienteId(itemValue)}
            style={styles.pickerPaciente}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Seleccionar paciente" value="" />
            {pacientes.map((paciente) => (
              <Picker.Item key={paciente.id} label={paciente.nombre} value={paciente.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.addPacienteButton} onPress={handleAddPaciente}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCita}>
          <Text style={styles.buttonText}>Añadir cita</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: dynamicFontSizeTitle,
    fontWeight: "bold",
    color: azulClaroPrincipal,
    textAlign: "center",
    marginTop: "5%",
  },
  picker: {
    borderWidth: 1,
    borderColor: azulMarinoPesado,
    borderRadius: 15,
    padding: "5%",
    marginTop: "10%",
    width: "85%",
    height: "12%",
    backgroundColor: "#f9f9f9",
  },
  pickerText: {
    fontSize: dynamicFontSize,
    color: "#333",
  },
  pacienteRow: {
    flexDirection: "row",
    marginTop: "10%",
    maxWidth: "80%",
    height: "12%",
    padding: 0,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: azulMarinoPesado,
    borderRadius: 15,
    width: "70%",
    height: "100%",
    backgroundColor: "#f9f9f9",
    padding: 0,
  },
  pickerPaciente: {
    flex: 1,
    height: "100%",
  },
  pickerItem: {
    fontSize: dynamicFontSizeOption,
    color: "#333",
  },
  addPacienteButton: {
    marginLeft: "5%",
    backgroundColor: azulClaroPrincipal,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    height: "100%",
  },
  buttonContainer: {
    marginTop: "15%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  cancelButton: {
    backgroundColor: rojo,
    borderRadius: 10,
    width: "45%",
    height: "100%",
    alignItems: "center",
    padding: "6%",
  },
  addButton: {
    backgroundColor: verde,
    borderRadius: 10,
    width: "45%",
    height: "100%",
    alignItems: "center",
    padding: "6%",
  },
  buttonText: {
    color: "#fff",
    fontSize: dynamicFontSizeOption,
    fontWeight: "bold",
    textAlign: "center",
  },
});
