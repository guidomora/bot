import twilio from "twilio";
import { envs } from "../../config/envs";


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
