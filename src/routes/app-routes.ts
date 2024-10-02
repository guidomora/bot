import { Router } from "express";
import { BotRoutes } from "./routes";

export class AppRoutes{
    static get routes(): Router {
        const router = Router();

        router.use('/bot', BotRoutes.routes);

        return router;
    }
}