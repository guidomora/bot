import { getFreeHoursDay } from "../../services/reservations/reservationService"

export class BotResponses {
    public freeHoursDay = async (gptResponse: string, date:string) => {
        const hours = await getFreeHoursDay(date)
        const day = hours[0][0]
        const times = hours.map(([_, time]) => time);
        const formattedResponse = `${day}: ${times.join(', ')}`;
        const responseMatch = gptResponse.match(/response:\s*(.*?)\s{2}/);
        const responseContent = responseMatch ? responseMatch[1] : "No response found";

        const finalResponse = `${responseContent}\n\n${formattedResponse}`;
        console.log(finalResponse);
        return finalResponse;
    }

}
