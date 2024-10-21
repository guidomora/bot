import { Router } from "express";
import { BotController } from "../controllers/botController";
import { TwilioControllers } from "../controllers/twilioControllers/twilioControllers";


export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        const botController = new BotController()
        const twilioController = new TwilioControllers()






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
        // -------------------------------
        router.get('/message', twilioController.testMsg)
        router.post('/message', twilioController.getMsgs)



        return router
    }
}