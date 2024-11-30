import { getDatabase, push, ref } from "firebase/database";

const addDefaultCitas = async () => {
  try {
    const db = getDatabase();

    // Lista de IDs de los pacientes
    const patientIds = [
      "-0Cv02s7y-SFHsP7BTDp",
      "-0Cv0e1q7tLX8HJF98Dg",
      "-0Cv0e3Xac5QkA0V6x80",
      "-0Cv0e4zRHdy7G5PcnB-",
      "-0Cv0e6FSNQkVleekCXI",
      "-0Cv0e7r26rAd3vINj-5",
    ];

    // Lista de citas por defecto
    const citas = patientIds.map((id, index) => ({
      fecha: `2023-12-${10 + index}`, // Genera fechas consecutivas
      hora: `${9 + index}:00`, // Genera horas consecutivas
      idPaciente: id, // Asocia cada cita a un paciente
    }));

    // Agregar cada cita a la base de datos
    for (const cita of citas) {
      await push(ref(db, "citas/"), cita);
    }

    console.log("Citas añadidas correctamente.");
  } catch (error) {
    console.error("Error añadiendo citas:", error);
  }
};

export default addDefaultCitas;
