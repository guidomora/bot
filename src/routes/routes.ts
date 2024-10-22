import { Router } from "express";
import { TwilioControllers } from "../controllers/twilioControllers/twilioControllers";
import { ServerControllers } from "../controllers/serverControllers/serverControllers";


export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        // const botController = new BotController()
        const twilioController = new TwilioControllers()
        const serverController = new ServerControllers()






        router.post('/newday', serverController.getDataSheets)
        router.post('/welcome', serverController.handleWriteToSheet)
        router.post('/rows', serverController.addClientAndService)
        router.put('/blockDay', serverController.blockDay)
        router.put('/blockRange', serverController.blockRange)
        router.get('/nextReservations', serverController.getAllReservations)
        router.get('/freeDay', serverController.getFreeHoursInDay)
        router.get('/today', serverController.allReservationsToday)
        router.get('/resevationsDays', serverController.getReservationsForNextDays)
        router.delete('/reservation', serverController.deleteReservation)
        // -------------------------------
        router.get('/message', twilioController.testMsg)
        router.post('/message', twilioController.getMsgs)



        return router
    }
}