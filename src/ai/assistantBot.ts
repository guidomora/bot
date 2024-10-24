import { getFreeHoursDay } from "../services/reservations/reservationService";
import { openai } from "./openaiClient";


// TODO: crear funciones para que sepa que si le dicen hoy sepa el dia de hoy numbreDia, numero, mesNombre.
// TODO: crear funciones para que sepa que si le dicen mañana sepa el dia de mañana numbreDia, numero, mesNombre.
// const today = new Date();
// const tomorrow = new Date(today);
// tomorrow.setDate(today.getDate() + 1);
// const tomorrowFormatted = tomorrow.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });




// agrgar cantidad de max tokens
export async function processReservationQuery(userMessage: string) {
  try {
    // Realiza la llamada a la API de OpenAI sin streaming
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", 
            content: `Tu nombre es "GuidoBot" y eres un asistente encargado exclusivamente de gestionar reservas del restaurante "BotRestaurant".
                    Tu tarea principal es identificar la acción correcta que el usuario quiere realizar en formato 'action: <nombre de la acción>' al final de cada respuesta.
                    Las acciones posibles son: 'crear_reserva', 'consultar_disponibilidad', 'modificar_reserva', 'cancelar_reserva'.
                    Siempre vas a tener que identificar la fecha (formato 'nombreDia numero mesNombre') y el horario (formato hh:mm) que ingresó el usuario y devolverlos en formato 'fecha: nombreDia numero mesNombre' y 'horario: hh:mm'.
                    No puedes asumir la disponibilidad de fechas u horarios, solo identifica la intención del usuario. 
                    La disponibilidad actual es de 10:00 a 22:00 de lunes a viernes y de 12:00 a 23:00 los fines de semana.`
          
          },
        { role: "user", content: userMessage }
      ],
      max_tokens:80
    });

    // Devuelve la respuesta completa
    const gptResponse = response.choices[0].message.content;

    // Extraer el mensaje visible para el usuario
    const userMessagePart = gptResponse!.split("action:")[0].trim();

    // Ajustar las expresiones regulares para capturar la acción, fecha y horario
    const actionMatch = gptResponse!.match(/action: (\w+)/);
    const dateMatch = gptResponse!.match(/fecha: (\w+\s\d{1,2}\s\w+)/);  // Captura la fecha: nombre del día, número y mes
    const timeMatch = gptResponse!.match(/horario: ([\d]{2}:[\d]{2})/);  // Captura la hora solo en formato hh:mm

    const action = actionMatch ? actionMatch[1] : null;
    const date = dateMatch ? dateMatch[1].trim() : null;
    const time = timeMatch ? timeMatch[1].trim() : null;

    console.log({
      userMessage: userMessagePart,
      action,
      date,
      time
    });

    getFreeHoursDay(date!)

    return {
      userMessage: userMessagePart,  // Mensaje visible para el usuario
      action,  // Acción para el sistema (crear_reserva, etc.)
      date,   // Fecha capturada (ej. "viernes 24 octubre")
      time  // Hora capturada (ej. "21:00")
    };
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    throw error; 
  }
}

const actions = ['add_reservation', 'get_nextReservations', 'get_freeHoursInDay', 'cancel_reservation']

// TODO: captar la rta del usuario, que gpt la analice, detecte la intencion y decida que funcion ejecutar en base a las opciones
// disponibles y luego pasarlo a un switch case para ejecutar la funcion correspondiente


// Tu nombre es "GuidoBot" y eres un asistente encargado exclusivamente de gestionar reservas del restaurante "BotRestaurant". 
//                     Si la acción es crear_reserva, debes identificar la fecha y el horario que ingresó el usuario.
//                     Siempre proporciona la hora en formato 'hh:mm'.
//                     Tu tarea principal es identificar la acción correcta que el usuario necesita en formato 'action: <nombre de la acción>' al final de cada respuesta.
//                     Las acciones posibles son: 'crear_reserva fecha: nombreDia numero mesNombre y horario en formato hh:mm indicado por el usuario', 'consultar_disponibilidad', 'modificar_reserva', 'cancelar_reserva'.
//                     No puedes asumir la disponibilidad de fechas u horarios, solo identifica la intención del usuario. 
//                     La disponibilidad actual es de 10:00 a 22:00 de lunes a viernes y de 12:00 a 23:00 los fines de semana.