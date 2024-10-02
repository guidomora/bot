import { Router } from "express";
import { BotController } from "../controllers/botController";

export class BotRoutes {
    static get routes(): Router {
        const router = Router()
        const botController = new BotController()






        router.get('/welcome', botController.getDataSheets)
        router.put('/welcome', botController.handleWriteToSheet)



        return router
    }
}