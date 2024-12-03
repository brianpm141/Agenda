import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Agenda } from 'react-native-calendars';
import {
  amarilloLigero,
  amarilloPesado,
  amarilloPrincipal,
  azulCieloPrincipal,
  azulMarinoPesado,
  background,
  dynamicFontSizeMinimal,
  dynamicFontSizeOption,
  dynamicFontSizeText,
  verde,
  verdePesado,
} from "../../styleColors";

export default function Home() {
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
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const date = d.toISOString().split('T')[0];
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
        });
      }

      setItems(formattedItems);
    });
  }, [pacientes]);
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>Agrega una cita!</Text>
      </View>
    );
  };
    return (
          <Agenda
            items={items}
            renderItem={(item, firstItemInDay) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemTextHora}>{item.time}</Text>
                <Text style={styles.itemTextPaciente}>{item.name}</Text>
              </TouchableOpacity>
            )}
            renderEmptyDate={renderEmptyDate}
            showClosingKnob={true}
          />
      );
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: azulCieloPrincipal,
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 25,
      paddingBottom:20
    },
    itemTextHora: {
      color: verdePesado,
      fontSize: 16,
    },
    itemTextPaciente: {
      color: amarilloPesado,
      fontSize: 20,
      fontWeight: 'bold',
    },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  });
