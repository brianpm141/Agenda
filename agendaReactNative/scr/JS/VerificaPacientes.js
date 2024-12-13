import { getDatabase, ref, onValue } from "firebase/database";

// Esta función verifica si el paciente tiene citas
const verificarCitasPaciente = (idPaciente) => {
  const db = getDatabase();
  const citasRef = ref(db, "citas");
  
  return new Promise((resolve, reject) => {
    let tieneCitas = false;

    // Verificamos si el paciente tiene citas
    onValue(citasRef, (snapshot) => {
      const citas = snapshot.val();
      for (let key in citas) {
        if (citas[key].idPaciente === idPaciente) {
          tieneCitas = true;
          break;
        }
      }
      resolve(tieneCitas); // Devolvemos el resultado de la verificación
    }, (error) => {
      reject(error); // En caso de error, rechazamos la promesa
    });
  });
};

export default verificarCitasPaciente;
