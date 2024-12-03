import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDatabase, ref, update, onValue, remove } from "firebase/database";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  rojoPesado,
} from "../../styleColors";

export default function ModificaCita() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [pacienteId, setPacienteId] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const { cita } = route.params || {}; // Recibir la cita seleccionada
  console.log(cita);
  
  useEffect(() => {
    const db = getDatabase();
    const pacientesRef = ref(db, "pacientes");

    // Cargar lista de pacientes
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

    // Configurar los valores iniciales de la cita seleccionada
    if (cita) {
      setDate(cita.fecha ? new Date(cita.fecha + "T00:00") : null); // Ajustar zona horaria
      setTime(cita.hora || null);
      setPacienteId(cita.idPaciente || "");
    }
  }, [cita]);

  const handleUpdateCita = () => {
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
    if (!cita || !cita.id) {
      Alert.alert("Error", "No se encontró el identificador de la cita.");
      return;
    }

    const db = getDatabase();
    const citaRef = ref(db, `citas/${cita.id}`); // Asegúrate de usar el ID correcto

    update(citaRef, {
      fecha: date.toISOString().split("T")[0], // Formato YYYY-MM-DD
      hora: time, // Hora en formato HH:mm
      idPaciente: pacienteId,
    })
      .then(() => {
        Alert.alert("Cita actualizada", "La cita fue modificada exitosamente.");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleDeleteCita = () => {
    if (!cita || !cita.id) {
      Alert.alert("Error", "No se encontró el identificador de la cita.");
      return;
    }

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const db = getDatabase();
            const citaRef = ref(db, `citas/${cita.id}`);

            remove(citaRef)
              .then(() => {
                Alert.alert("Cita eliminada", "La cita fue eliminada exitosamente.");
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert("Error", error.message);
              });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
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
      <Text style={styles.title}>Modificar Cita</Text>

      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.pickerText}>
          {date ? date.toLocaleDateString("en-CA") : "Seleccionar fecha"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.pickerText}>{time || "Seleccionar hora"}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time ? new Date(`1970-01-01T${time}:00`) : new Date()}
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
              <Picker.Item
                key={paciente.id}
                label={paciente.nombre}
                value={paciente.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleUpdateCita}>
          <Text style={styles.buttonText}>Actualizar cita</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainerDel}>
      <TouchableOpacity
        style={styles.ButtonDel}
        onPress={handleDeleteCita}
      >
        <Text style={styles.buttonText}>Eliminar cita</Text>
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
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: azulMarinoPesado,
    borderRadius: 15,
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
  },
  pickerPaciente: {
    flex: 1,
    height: "100%",
  },
  pickerItem: {
    fontSize: dynamicFontSizeOption,
    color: "#333",
  },
  buttonContainer: {
    marginTop: "15%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonContainerDel: {
    marginTop: "5%",
    height: "10%",
    flexDirection: "row",
    width: "80%",
    justifyContent: 'center'
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
    padding: "4%",
  },
  ButtonDel: {
    backgroundColor: rojoPesado,
    borderRadius: 10,
    width: "70%",
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
