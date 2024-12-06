import { checkHourDay, deleteReservation, getFreeHoursDay } from "../services/reservations/reservationService";
import { extractDetails, handleCreateReservation, moveReservation } from "./actions/actions";
import { mainPrompt } from "./helpersChat/prompts";
import { openai } from "./openaiClient";
import { BotResponses } from "./responses/botResponses";



// FIXME: 1)Creo que es mejor volver a procesar de nuevo los datos para la funcion de modificar_reserva
// FIXME: 3) hacer algo para que el servicio en caso de un restaurante no lo tenga que procesar, seria util en otro rubro

export async function processReservationQuery(userMessage: string) {

  const botResponse = new BotResponses() 

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

    const {action, date, time, user, service, newDate, newTime, singleLineMessage} = await extractDetails(gptResponse!)
    

    // console.log({
    //   userMessage,
    //   singleLineMessage,
    //   action,
    //   date,
    //   time,
    //   user,
    //   service,
    //   newDate,
    //   newTime
    // });

    switch(action){
      case 'crear_reserva':{
        
        return await handleCreateReservation(date!, time!, user!, service!)
      }
      case 'buscar_disponibilidad':{
        return await checkHourDay(date!, time!)
      }
      case 'cancelar_reserva':{
        // TODO:: 2) agregar user y service
        return await deleteReservation(date!, time!)
      }
      // TODO: 1)ajusstes aca
      case 'modificar_reserva': {
        return await moveReservation(date!, time!, newDate!, newTime!, user!, service!)
      }
      case 'horas_libres_en_dia':{
        return await botResponse.freeHoursDay(singleLineMessage!, date!)
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

