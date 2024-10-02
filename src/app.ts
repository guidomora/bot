import { envs } from "./config/envs";
// import { createDay, createDaysForTwoWeeks, repeatDay, repeatDayNew } from "./helpers/helpers";
// import { writeToSheet } from "./data/sheetsConnection";
import { AppRoutes } from "./routes/app-routes";
import { Server } from "./server/server";
import { getLastRowValue } from "./services/sheetsServices";

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


