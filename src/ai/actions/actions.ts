import { addReservation, checkHourDay } from "../../services/reservations/reservationService";
import { openai } from "../openaiClient";

export async function handleCreateReservation(date: string, time: string) {
    const isAvailable = await checkHourDay(date, time);
    if (isAvailable) {
        const customer = "Guido";
        const service = "cenita";
        await addReservation(date, time, customer, service);
        return `Reserva confirmada para ${date} a las ${time}. ¡Gracias por reservar con nosotros!`;
    } else {
        return `Lo siento, el horario de ${time} en la fecha ${date} no está disponible. Por favor, elige otro horario o fecha.`;
    }
}



async function validateData(message: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Tu tarea principal es identificar la acción correcta que el usuario quiere realizar en formato 'action: <nombre de la acción>' al final de cada respuesta.
                          Las acciones posibles son: 'crear_reserva', 'consultar_disponibilidad', 'modificar_reserva', 'cancelar_reserva'.
                          Siempre vas a tener que identificar la fecha (formato 'nombreDia numero mesNombre') y el horario (formato hh:mm) que ingresó el usuario y devolverlos en formato 'fecha: nombreDia numero mesNombre' y 'horario: hh:mm'.
                          No puedes asumir la disponibilidad de fechas u horarios, solo identifica la intención del usuario.`

                },
                { role: "user", content: message }
            ],
            max_tokens: 80
        });
        const gptResponse = response.choices[0].message.content;
        return gptResponse
    } catch (error) {
        console.error("Error en validateData:", error);
        throw error;
    }
}

//   RegEx para extraer los parametros y validarlos
export async function extractDetails(message: string) {
    let action: string | null = null;
    let date: string | null = null;
    let time: string | null = null;
    const maxAttempts = 3;
    let attempts = 0;
  
    // Primer análisis de la respuesta original para obtener acción, fecha y horario
    const initialMatch = message.match(/action: (\w+)/);
    const initialDateMatch = message.match(/fecha: (\w+\s\d{1,2}\s\w+)/);
    const initialTimeMatch = message.match(/horario: ([\d]{2}:[\d]{2})/);
  
    action = initialMatch ? initialMatch[1] : null;
    date = initialDateMatch ? initialDateMatch[1].trim() : null;
    time = initialTimeMatch ? initialTimeMatch[1].trim() : null;
  
    // segundo analisis ya que puede ser que sean null
    while ((action === null || date === null || time === null) && attempts < maxAttempts) {
      const responseMessage = await validateData(message);
  
      const actionMatch = responseMessage!.match(/action: (\w+)/);
      const dateMatch = responseMessage!.match(/fecha: (\w+\s\d{1,2}\s\w+)/);
      const timeMatch = responseMessage!.match(/horario: ([\d]{2}:[\d]{2})/);
  
      action = actionMatch ? actionMatch[1] : action;
      date = dateMatch ? dateMatch[1].trim() : date;
      time = timeMatch ? timeMatch[1].trim() : time;
  
      console.log("Revalidando..........");
      attempts++;
    }
  
    return {
      action,
      date,
      time,
    };
  }



  // Objeto para almacenar el historial de conversación en memoria
const conversationHistory: Record<string, any> = {};

// Función para procesar mensajes
export async function processReservationQuery(userMessage: string, userId: string) {
    // Inicia historial de conversación si no existe para este usuario
    if (!conversationHistory[userId]) {
        conversationHistory[userId] = {
            messages: [],
            lastIntent: null,
            reservationDetails: { date: null, time: null }
        };
    }

    const history = conversationHistory[userId];
    
    // Almacena el mensaje en el historial
    history.messages.push({ user: userMessage });

    // Consulta a GPT con el mensaje y el historial de contexto
    const responseMessage = await validateData(userMessage);
    const { action, date, time } = await extractDetails(responseMessage!);

    // Si se identifican fecha y hora, guarda en el historial
    if (date && time) {
        history.reservationDetails.date = date;
        history.reservationDetails.time = time;
    }

    // Almacena la intención detectada para el siguiente mensaje
    history.lastIntent = action;

    // Ejemplo de respuesta usando historial (para mensajes de confirmación)
    if (action === "crear_reserva" && history.lastIntent === "consultar_disponibilidad" &&
        history.reservationDetails.date && history.reservationDetails.time) {
        const response = `Perfecto, se ha creado la reserva para el ${history.reservationDetails.date} a las ${history.reservationDetails.time}.`;
        history.messages.push({ gpt: response });
        return response;
    }

    // Guarda la respuesta de GPT en el historial
    history.messages.push({ gpt: responseMessage });
    return responseMessage;
}



