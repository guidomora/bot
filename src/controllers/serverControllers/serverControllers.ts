import { Request, Response } from "express"
import { repeatDay } from "../../helpers/helpers"
import { getLastRowValue, writeToSheet, blockDayReservation, blockHoursRange } from "../../services/days/daysService"
import { getReservationsRows, getFreeHoursDay, getDayReservationsRows, addReservation, deleteReservation, getReservationsForNextDays, checkHourDay } from "../../services/reservations/reservationService"

export class ServerControllers {
    public getDataSheets = async(req: Request, res: Response) => {
        const result = await getLastRowValue()
        res.status(200).json(result)
    }

    public getAllReservations = async (req:Request, res:Response) => {
        const result = await getReservationsRows()
        res.status(200).json(result)
    }

    public getFreeHoursInDay = async (req:Request, res:Response) => {
        const {date} = req.body
        const result = await getFreeHoursDay(date)
        res.status(200).json(result)
    }

    public allReservationsToday = async (req:Request, res:Response) => {
        const result = await getDayReservationsRows()
        res.status(200).json(result)
    }

    public handleWriteToSheet = async(req: Request, res: Response) => {
        const values = repeatDay(); // Cambia esto según tus necesidades
        const result = await writeToSheet(values);
        res.status(200).json(result);
    }

    public addClientAndService = async(req:Request, res:Response) => {
        const {date, time, customer, service} = req.body
        const result = await addReservation(date, time, customer, service)
        res.status(200).json(result)
    }

    public deleteReservation = async (req:Request, res:Response) => {
        const {date, time} = req.body
        const result = await deleteReservation(date, time)
        res.status(200).json(result)
    }

    public blockDay = async (req:Request, res:Response) => {
        const {date} = req.body
        const result = await blockDayReservation(date)
        res.status(200).json(result)
    }

    public blockRange = async (req:Request, res:Response) => {
        const {date, startTime, endTime} = req.body
        const result = await blockHoursRange(date, startTime, endTime)
        res.status(200).json(result)
    }

    public getReservationsForNextDays = async (req: Request, res: Response) => {
        const { days } = req.query;
        const daysCount = days ? parseInt(days as string) : 7;  // Por defecto, 7 días si no se especifica
        const result = await getReservationsForNextDays(daysCount);
        res.status(200).json(result);
    };

    public checkHourAvailability = async (req:Request, res:Response) => {
        const {date, time} = req.body
        const result = await checkHourDay(date, time)
        res.status(200).json(result)
    }
}