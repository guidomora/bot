import { addReservation, checkHourDay, deleteReservation } from "../../services/reservations/reservationService";
import { mainPrompt } from "../helpersChat/prompts";
import { openai } from "../openaiClient";

export async function handleCreateReservation(date: string, time: string, user: string, service:string) {
    const isAvailable = await checkHourDay(date, time);
    if (isAvailable) {
        await addReservation(date, time, user, service);
        return `Reserva confirmada para ${date} a las ${time}. ¡Gracias por reservar con nosotros!`;
    } else {
        return `Lo siento, el horario de ${time} en la fecha ${date} no está disponible. Por favor, elige otro horario o fecha.`;
    }
}



async function validateData(message: string) {
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: mainPrompt

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

// TODO: 3)original
//   RegEx para extraer los parametros y validarlos
// export async function extractDetails(message: string) {
//     let action: string | null = null;
//     let date: string | null = null;
//     let time: string | null = null;
//     let newDay: string | null = null;
//     let newTime: string | null = null
//     const maxAttempts = 3;
//     let attempts = 0;

//     // Primer análisis de la respuesta original para obtener acción, fecha y horario
//     const initialMatch = message.match(/action: (\w+)/);
//     const initialDateMatch = message.match(/fecha: (\w+\s\d{1,2}\s\w+)/);
//     const initialTimeMatch = message.match(/horario: ([\d]{2}:[\d]{2})/);
//     const initialNewDayMatch = message.match(/newFecha: (\w+\s\d{1,2}\s\w+)/);
//     const initialNewTimeMatch = message.match(/newHora: ([\d]{2}:[\d]{2})/);

//     action = initialMatch ? initialMatch[1] : null;
//     date = initialDateMatch ? initialDateMatch[1].trim() : null;
//     time = initialTimeMatch ? initialTimeMatch[1].trim() : null;

//     // segundo analisis ya que puede ser que sean null
//     while ((action === null || date === null || time === null) && attempts < maxAttempts) {
//         const responseMessage = await validateData(message);

//         const actionMatch = responseMessage!.match(/action: (\w+)/);
//         const dateMatch = responseMessage!.match(/fecha: (\w+\s\d{1,2}\s\w+)/);
//         const timeMatch = responseMessage!.match(/horario: ([\d]{2}:[\d]{2})/);

//         action = actionMatch ? actionMatch[1] : action;
//         date = dateMatch ? dateMatch[1].trim() : date;
//         time = timeMatch ? timeMatch[1].trim() : time;

//         console.log("Revalidando..........");
//         attempts++;
//     }

//     return {
//         action,
//         date,
//         time,
//     };
// }

export async function extractDetails(message: string) {
    let action: string | null = null;
    let date: string | null = null;
    let time: string | null = null;
    let newDate: string | null = null;
    let newTime: string | null = null;
    let user: string | null = null;
    // let service: string | null = null;
    let service: string | null = "cena";

    const maxAttempts = 3;
    let attempts = 0;

    const singleLineMessage = message.replace(/\n/g, " ");

    // Primer análisis con límites de captura ajustados para `user` y `service`
    const actionMatch = singleLineMessage.match(/action:\s*(\w+)/i);
    const dateMatch = singleLineMessage.match(/fecha:\s*(\w+\s\d{1,2}\s\w+)/i);
    const timeMatch = singleLineMessage.match(/horario:\s*([\d]{2}:[\d]{2})/i);
    const userMatch = singleLineMessage.match(/user:\s*"?([^"]+?)"?(?=\s|$)/i);
    const serviceMatch = singleLineMessage.match(/service:\s*"?([^"]+?)"?(?=\s|$)/i);

    // Solo intenta extraer `newDate` y `newTime` si es una modificación de reserva
    if (singleLineMessage.toLowerCase().includes('modificar_reserva')) {
        const newDateMatch = singleLineMessage.match(/nueva_fecha:\s*(\w+\s\d{1,2}\s\w+)/i);
        const newTimeMatch = singleLineMessage.match(/nuevo_horario:\s*([\d]{2}:[\d]{2})/i);
        newDate = newDateMatch ? newDateMatch[1].trim() : null;
        newTime = newTimeMatch ? newTimeMatch[1].trim() : null;
    }

    action = actionMatch ? actionMatch[1] : null;
    date = dateMatch ? dateMatch[1].trim() : null;
    time = timeMatch ? timeMatch[1].trim() : null;
    user = userMatch ? userMatch[1].trim() : null;
    service = serviceMatch ? serviceMatch[1].trim() : null;

    if (!singleLineMessage.toLowerCase().includes('no_action')) {
        // Segundo análisis para intentar obtener datos faltantes
        while ((action === null || date === null || time === null || (singleLineMessage.toLowerCase().includes('modificar_reserva') && (newDate === null || newTime === null))) && attempts < maxAttempts) {
            const responseMessage = await validateData(singleLineMessage);

            const actionMatch = responseMessage!.match(/action:\s*(\w+)/i);
            const dateMatch = responseMessage!.match(/fecha:\s*(\w+\s\d{1,2}\s\w+)/i);
            const timeMatch = responseMessage!.match(/horario:\s*([\d]{2}:[\d]{2})/i);
            const userMatch = responseMessage!.match(/user:\s*"?([^"]+?)"?(?=\s|$)/i);
            const serviceMatch = responseMessage!.match(/service:\s*"?([^"]+?)"?(?=\s|$)/i);

            action = actionMatch ? actionMatch[1] : action;
            date = dateMatch ? dateMatch[1].trim() : date;
            time = timeMatch ? timeMatch[1].trim() : time;
            user = userMatch ? userMatch[1].trim() : user;
            service = serviceMatch ? serviceMatch[1].trim() : service;

            // Reintentar capturar `newDate` y `newTime` si es una modificación de reserva
            if (message.toLowerCase().includes('modificar_reserva')) {
                const newDateMatch = responseMessage!.match(/nueva_fecha:\s*(\w+\s\d{1,2}\s\w+)/i);
                const newTimeMatch = responseMessage!.match(/nuevo_horario:\s*([\d]{2}:[\d]{2})/i);

                newDate = newDateMatch ? newDateMatch[1].trim() : newDate;
                newTime = newTimeMatch ? newTimeMatch[1].trim() : newTime;
            }

            console.log("Revalidando..........");
            attempts++;
        }
    }

    return {
        singleLineMessage,
        action,
        date,
        time,
        user,
        service,
        newDate,
        newTime,
    };
}





export async function moveReservation(date: string, time: string, newDate: string, newTime: string, user:string, service:string) {
    await deleteReservation(date, time)
    await addReservation(newDate, newTime, user, service)
}



