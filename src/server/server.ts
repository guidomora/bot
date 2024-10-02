import express, {Router} from 'express'
import cors from 'cors'

interface Options {
    port:number;
    public_path:string;
    routes:Router
}

export class Server {
    private app = express()
    private readonly port:number;
    private readonly public_path: string;
    private readonly routes:Router;

    constructor (options:Options) {
        const {port, public_path, routes} = options
        this.port = port
        this.public_path = public_path
        this.routes = routes
    }

    async start() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:true}))
        this.app.use(this.routes)

        this.app.listen(this.port, () => {
            console.log(`Server running at: http://localhost:${this.port}`);
            
        })
    }
}