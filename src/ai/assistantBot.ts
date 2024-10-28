import { checkHourDay, deleteReservation } from "../services/reservations/reservationService";
import { extractDetails, handleCreateReservation, moveReservation } from "./actions/actions";
import { openai } from "./openaiClient";
import readline from "readline"

// TODO: 1)crear funciones para que sepa que si le dicen hoy sepa el dia de hoy numbreDia, numero, mesNombre.
// TODO: 2)crear funciones para que sepa que si le dicen mañana sepa el dia de mañana numbreDia, numero, mesNombre.
// const today = new Date();
// const tomorrow = new Date(today);
// tomorrow.setDate(today.getDate() + 1);
// const tomorrowFormatted = tomorrow.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });




// FIXME: 3)Creo que es mejor volver a procesar de nuevo los datos para la funcion de modificar_reserva

export async function processReservationQuery(userMessage: string) {
  try {
    // Realiza la llamada a la API de OpenAI sin streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", 
            content: `Tu nombre es "GuidoBot" y eres un asistente encargado exclusivamente de gestionar reservas del restaurante "BotRestaurant e interactuar con el cliente".
                    Tu tarea principal es identificar la acción correcta que el usuario quiere realizar en formato 'action: <nombre de la acción>' al final de cada respuesta.
                    Las acciones posibles son: 'crear_reserva', 'buscar_disponibilidad', 'modificar_reserva', 'cancelar_reserva' 'no_action'.
                    Siempre vas a tener que identificar la fecha (formato 'nombreDia numero mesNombre') y el horario (formato hh:mm) que ingresó el usuario y devolverlos en formato 'fecha: nombreDia numero mesNombre' y 'horario: hh:mm'.
                    No puedes asumir la disponibilidad de fechas u horarios, solo identifica la intención del usuario. 
                    La disponibilidad actual es de 10:00 a 22:00 de lunes a viernes y de 12:00 a 23:00 los fines de semana.
                    Acordate de identificar el horario en formato hh:mm por favor
                    Si la accion es modificar_reserva, ademas de captar la fecha (formato 'nombreDia numero mesNombre') y horario (formato hh:mm),
                    vas a tener que captar la fecha nueva 'nueva_fecha: formato <nombreDia numero mesNombre>' y horario nuevo 'nuevo_horario: formato <hh:mm>'`
          
          },
        { role: "user", content: userMessage }
      ],
      max_tokens:80
    });
    // Devuelve la respuesta completa
    const gptResponse = response.choices[0].message.content;

    const {action, date, time, newDate, newTime, singleLineMessage} = await extractDetails(gptResponse!)
    

    console.log({
      userMessage,
      singleLineMessage,
      action,
      date,
      time,
      newDate,
      newTime
    });

    switch(action){
      case 'crear_reserva':{
        // TODO:: 4) agregar user y service
        return await handleCreateReservation(date!, time!)
      }
      case 'buscar_disponibilidad':{
        return await checkHourDay(date!, time!)
      }
      case 'cancelar_reserva':{
        // TODO:: 4) agregar user y service
        return await deleteReservation(date!, time!)
      }
      // TODO: 3)ajusstes aca
      case 'modificar_reserva': {
        // TODO:: 4) agregar user y service
        return await moveReservation(date!, time!, newDate!, newTime!)
      }
      default:{
        return gptResponse
      }
    }
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    throw error; 
  }
}

