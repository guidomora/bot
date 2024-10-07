import { Request, Response } from "express";
import { addReservation, getFreeHoursDay, getLastRowValue, getReservationsRows, writeToSheet } from "../services/sheetsServices";
import { repeatDay } from "../helpers/helpers";



export class BotController {
    
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

}