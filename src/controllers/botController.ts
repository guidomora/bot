import { Request, Response } from "express";
import { getLastRowValue, readSheet, writeToSheet } from "../services/sheetsServices";
import { repeatDay } from "../helpers/helpers";



export class BotController {
    
    public getDataSheets = async(req: Request, res: Response) => {
        const result = await getLastRowValue()
        res.status(200).json(result)
    }

    // public addAnotherDay = async(req: Request, res: Response) => {
    //     const value = await getLastDay()
    //     const result = repeatDayNew(value)
    //     res.status(200).json(result)
    // }


    public handleWriteToSheet = async(req: Request, res: Response) => {
        const values = repeatDay(); // Cambia esto según tus necesidades
        const result = await writeToSheet(values);
        res.status(200).json(result);
    }

}