import { Request, Response } from "express";
import { addReservation, getLastRowValue, getReservationsRows, writeToSheet } from "../services/sheetsServices";
import { repeatDay } from "../helpers/helpers";



export class BotController {
    
    public getDataSheets = async(req: Request, res: Response) => {
        const result = await getLastRowValue()
        res.status(200).json(result)
    }

    public getNextReservations = async (req:Request, res:Response) => {
        const result = await getReservationsRows()
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