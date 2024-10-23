import { openai } from "./openaiClient";




export async function processReservationQuery(userMessage: string) {
  try {
    // Realiza la llamada a la API de OpenAI sin streaming
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", 
            content: `Eres un asistente encargado exclusivamente de gestionar reservas de restaurantes. 
            Tu tarea principal es tomar nuevas reservas, modificar o cancelar las existentes, consultar 
            disponibilidad de días y horarios, y enviar recordatorios de reservas próximas. 
            No puedes responder a preguntas que no estén directamente relacionadas con la gestión de reservas.` },
        { role: "user", content: userMessage }
      ],
    });

    // Devuelve la respuesta completa
    return response.choices[0].message.content;  // Asegúrate de que esto coincide con la estructura de la respuesta
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    throw error; 
  }
}

// TODO: captar la rta del usuario, que gpt la analice, detecte la intencion y decida que funcion ejecutar en base a las opciones
// disponibles y luego pasarlo a un switch case para ejecutar la funcion correspondiente