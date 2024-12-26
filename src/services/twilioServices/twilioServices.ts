import twilio from "twilio";
import { envs } from "../../config/envs";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
import { processReservationQuery } from "../../ai/assistantBot";


const accountSid = envs.TWILIO_ID;
const authToken = envs.TWILIO_TKN;
const client = twilio(accountSid, authToken);

export async function createMessage() {
  const message = await client.messages.create({
    body: "holaaaaaaaa prueba desde pc",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+5491154916243",
  });

  console.log(message.body);
}

export const processIncomingMessage = async (from: string, body: string) => {
  console.log(`Mensaje recibido de ${from}: ${body}`);

  try {
    // Llama a processReservationQuery con el mensaje del usuario
    await processReservationQuery(body);

    // Asegúrate de que dialogue sea un string antes de enviarlo a Twilio


    // Genera la respuesta de Twilio con el contenido del diálogo
    const twiml = new MessagingResponse();
    twiml.message("procesando......");  // Asegúrate de pasar un string

    // Retorna la respuesta formateada en Twilio
    return twiml.toString();
  } catch (error) {
    console.error("Error al procesar el mensaje entrante:", error);

    // Respuesta de error en caso de fallo
    const twiml = new MessagingResponse();
    twiml.message(
      "Lo sentimos, ocurrió un problema al procesar tu mensaje. Por favor, inténtalo nuevamente más tarde."
    );

    return twiml.toString();
  }
};


