import { envs } from "./config/envs";
import { AppRoutes } from "./routes/app-routes";
import { Server } from "./server/server";


(() => {
    main()
})()

async function main() {
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
    })
    server.start()
}


