import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar"; // Librería de calendario
import "react-calendar/dist/Calendar.css"; // Estilos del calendario
import "./Home.css"; // Archivo de estilos personalizado

export default function Home() {
  const [pacientes, setPacientes] = useState({});
  const [items, setItems] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date());
  const db = getDatabase();
  const navigate = useNavigate();

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
      for (const key in data) {
        const { fecha, hora, idPaciente, atendido } = data[key];
        if (!formattedItems[fecha]) {
          formattedItems[fecha] = [];
        }
        formattedItems[fecha].push({
          name: `Paciente: ${pacientes[idPaciente]?.nombre || "Desconocido"}`,
          time: hora,
          estado: atendido,
          cita: { ...data[key], id: key },
        });
      }
      setItems(formattedItems);
    });
  }, [pacientes]);

  const handleNuevaCita = (date) => {
    navigate("/nueva-cita", { state: { selectedDay: date } });
  };

  const handleModificarCita = (cita) => {
    navigate("/modifica-cita", { state: { cita } });
  };

  const renderItemsForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return items[formattedDate]?.map((item, index) => (
      <div
        key={index}
        className="item"
        onClick={() => handleModificarCita(item.cita)}
      >
        <p className="item-time">{item.time}</p>
        <p className="item-name">{item.name}</p>
        <p
          className={`item-status ${item.estado ? "attended" : "not-attended"}`}
        >
          {item.estado ? "Atendido" : "No atendido"}
        </p>
      </div>
    ));
  };

  return (
    <div className="home-container">
      <Calendar
        onChange={(date) => setSelectedDay(date)}
        value={selectedDay}
        tileContent={({ date }) => renderItemsForDate(date)}
      />
      {items[selectedDay.toISOString().split("T")[0]]?.length === 0 && (
        <button
          className="new-appointment-button"
          onClick={() => handleNuevaCita(selectedDay)}
        >
          Sin citas pendientes
        </button>
      )}
    </div>
  );
}
