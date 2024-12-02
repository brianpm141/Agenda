import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Agenda } from 'react-native-calendars';
import {
  azulCieloPrincipal,
  azulMarinoPesado,
  background,
  dynamicFontSizeMinimal,
  dynamicFontSizeOption,
  dynamicFontSizeText,
  verde,
} from "../../styleColors";

export default function Home() {
  const [citas, setCitas] = useState({});
  const [pacientes, setPacientes] = useState({});
  const [items, setItems] = useState({});
  const db = getDatabase();

  useEffect(() => {
    
    const pacientesRef = ref(db, "pacientes");
    onValue(pacientesRef, (snapshot) => {
      const data = snapshot.val();
      setPacientes(data || {});
    });
  }, []);

  useEffect(() => {
    const citasRef = ref(db, 'citas');
    onValue(citasRef, (snapshot) => {
      const data = snapshot.val();
      const formattedItems = {};

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
        });
      }

      setItems(formattedItems);
    });
  }, [pacientes]);
    return (
          <Agenda
            items={items}
            renderItem={(item, firstItemInDay) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemText}>{item.time}</Text>
              </TouchableOpacity>
            )}
            showClosingKnob={true}
          />
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 0.95,
      justifyContent: 'center',
    },
    item: {
      backgroundColor: azulCieloPrincipal,
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 25,
      paddingBottom:20
    },
    itemText: {
      color: 'black',
      fontSize: 16,
    }
  });
