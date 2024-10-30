
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

    // processReservationQuery('hola, como estas? quisiera hacer una reserva para el viernes 25 de octubre a las 19hs')
    // processReservationQuery('hola, como estas? yo habia hecho una reserva para el viernes 25 de octubre a las 19hs y quisiera cancelarla')
    // processReservationQuery('hola, como estas? tenes una mesa disponible para el viernes 25 de octubre a las 19hs')
    // processReservationQuery('Perfecto quisiera hacer la reserva entonces')
    server.start()
}


