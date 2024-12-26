
import MessagingResponse from "twilio/lib/twiml/MessagingResponse"
import { createMessage, processIncomingMessage } from "../../services/twilioServices/twilioServices"
import { Request, Response } from "express"
import { processReservationQuery } from "../../ai/assistantBot"

export class TwilioControllers {
    
    public testMsg = async(req: Request, res: Response) => {
        const result = await createMessage()
        res.status(200).json(result)
    }


    // Remember to set ngrok to the port 3001 and put it in the twilio console
    public getMsgs = async (req: Request, res: Response) => {
        try {
          const from = req.body.From; // Número del remitente
          const body = req.body.Body; // Mensaje enviado por el usuario
      
          // Procesar el mensaje recibido
          const twimlResponse = await processIncomingMessage(from, body);  // Asegúrate de esperar la respuesta
      
          // Enviar respuesta a Twilio
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end(twimlResponse);  // Responder con la respuesta procesada
        } catch (error) {
          console.error('Error procesando el mensaje:', error);
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      };
      

    public interactWithBot = async (req: Request, res: Response) => {
        const {body} = req
        const response = await processReservationQuery(body.message)
        res.status(200).json(response)
    }
}