import { checkHourDay, deleteReservation } from "../services/reservations/reservationService";
import { extractDetails, handleCreateReservation, moveReservation } from "./actions/actions";
import { mainPrompt } from "./helpersChat/prompts";
import { openai } from "./openaiClient";



// FIXME: 3)Creo que es mejor volver a procesar de nuevo los datos para la funcion de modificar_reserva

export async function processReservationQuery(userMessage: string) {
  try {
    // Realiza la llamada a la API de OpenAI sin streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", 
            content: mainPrompt
          
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
      // TODO: 5) horarios libres de un dia
      default:{
        return gptResponse
      }
    }
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    throw error; 
  }
}

