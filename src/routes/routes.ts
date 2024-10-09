import { Router } from "express";
import { BotController } from "../controllers/botController";

export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        const botController = new BotController()






        router.post('/newday', botController.getDataSheets)
        router.post('/welcome', botController.handleWriteToSheet)
        router.post('/rows', botController.addClientAndService)
        router.put('/blockDay', botController.blockDay)
        router.put('/blockRange', botController.blockRange)
        router.get('/nextReservations', botController.getAllReservations)
        router.get('/freeDay', botController.getFreeHoursInDay)
        router.get('/today', botController.allReservationsToday)
        router.get('/resevationsDays', botController.getReservationsForNextDays)
        router.delete('/reservation', botController.deleteReservation)



        return router
    }
}