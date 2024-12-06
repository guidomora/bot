
import MessagingResponse from "twilio/lib/twiml/MessagingResponse"
import { createMessage } from "../../services/twilioServices/twilioServices"
import { Request, Response } from "express"
import { processReservationQuery } from "../../ai/assistantBot"

export class TwilioControllers {
    
    public testMsg = async(req: Request, res: Response) => {
        const result = await createMessage()
        res.status(200).json(result)
    }

    public getMsgs = async (req: Request, res: Response) => {
        const twilioMessage = req.body.Body; // Mensaje recibido en el body
        const fromNumber = req.body.From; // Número del remitente
        
        console.log(`Mensaje recibido de ${fromNumber}: ${twilioMessage}`);
      
        // Puedes enviar una respuesta de vuelta al usuario si quieres
        const twiml = new MessagingResponse();
        twiml.message("Gracias por tu mensaje, pronto te responderemos.");
      
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    }

    public interactWithBot = async (req: Request, res: Response) => {
        const {body} = req
        const response = await processReservationQuery(body.message)
        res.status(200).json(response)
    }
}