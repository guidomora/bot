import { Router } from "express";
import { BotController } from "../controllers/botController";

export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        const botController = new BotController()






        router.post('/newday', botController.getDataSheets)
        router.post('/welcome', botController.handleWriteToSheet)
        router.get('/rows', botController.addClientAndService)



        return router
    }
}