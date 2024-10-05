import { Request, Response } from "express";
import { getLastRowValue, getReservationsRows, readSheet, writeToSheet } from "../services/sheetsServices";
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
        const {date, time} = req.body
        const result = await readSheet(date, time)
        res.status(200).json(result)
    }

}