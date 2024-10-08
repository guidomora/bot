import { Router } from "express";
import { BotController } from "../controllers/botController";

export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        const botController = new BotController()






        router.post('/newday', botController.getDataSheets)
        router.post('/welcome', botController.handleWriteToSheet)
        router.post('/rows', botController.addClientAndService)
        router.get('/nextReservations', botController.getAllReservations)
        router.get('/freeDay', botController.getFreeHoursInDay)



        return router
    }
}