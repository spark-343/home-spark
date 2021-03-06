///<reference path="../../typings/index.d.ts"/>


import * as express from "express";
import * as http from "http";
/* import * as serveStatic from "serve-static"; */
import * as path from "path";
import * as dotenv from "dotenv";
import * as socketIo from "socket.io";
/*import * as mongoose from "mongoose";
import { RoomSocket } from "./room-socket"; */
import {IntegrationsManager} from "./integrations.manager";
import {DevicesManager} from "./devices.manager";
import {Mailer} from "./mailer";

declare var process, __dirname;

/**
 * The server.
 *
 * @class Server
 */
class Server {
    public app: any;
    private server: any;
    private io: any;
    // private mongo: any;
    private root: string;
    private port: number;

    private integrationsManager: IntegrationsManager;
    private devicesManager: DevicesManager;
    private mailer: Mailer;

    /**
    * Bootstrap the application.
    *
    * @class Server
    * @method bootstrap
    * @static
    * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
    */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
    * Constructor.
    *
    * @class Server
    * @constructor
    */
    constructor() {
        // instanciate servicesManager
        this.integrationsManager = new IntegrationsManager();
        //console.log(this.servicesManager);
        this.devicesManager = new DevicesManager();

        this.mailer = new Mailer();

        // Create expressjs application
        this.app = express();

        // Configure application
        this.config();

        // Setup routes
        this.routes();

        // Create server
        this.server = http.createServer(this.app);

        // Create database connections
        // this.databases();

        // Handle websockets
        this.sockets();



        // Start listening
        this.listen();

    }

    /**
     * Configuration
     *
     * @class Server
     * @method config
     * @return void
     */
    private config(): void {
        // Read .env file (local development)
        dotenv.config();

        // By default the port should be 5000
        this.port = process.env.PORT || 8080;

        // root path is under ../../target
        this.root = path.join(path.resolve(__dirname, '../public'));

    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes(): void {
        let router: express.Router;
        router = express.Router();

        let thiis = this;

        // Static assets
        this.app.get('/mail', function (req, res, next) {
            thiis.mailer.send('thibfrie@gmail.com', 'Magic link to sign-in', 'test', '<b>test</b>');
            res.send('ok');
        });
        this.app.use(express.static(this.root));
        this.app.use(express.static(path.join(this.root, 'app')));

        this.app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));
        this.app.use('/typings', express.static(path.join(__dirname, '../../typings')));
        // this.app.use('/models', express.static(path.join(__dirname, '../models')));

        // Set router to serve index.html (e.g. single page app)
        router.get('/', (request: express.Request, result: express.Response) => {
            console.log(request.url);
             result.sendFile(path.join(this.root, '/index.html'));
        });

        // Set app to use router as the default route
        this.app.use('*', router);
    }

    /**
     * Configure databases
     *
     * @class Server
     * @method databases
     * @return void
     */
    private databases(): void {
        // MongoDB URL
        // let mongoDBUrl = process.env.MONGODB_URI || 'mongodb://localhost/chat';

        // Get MongoDB handle
        // this.mongo = mongoose.connect(mongoDBUrl);
    }

    /**
     * Configure sockets
     *
     * @class Server
     * @method sockets
     * @return void
     */
    private sockets(): void {
        // Get socket.io handle
        this.io = socketIo(this.server);
        // console.log('sockets', this.servicesManager);
        let thiis = this;
        this.io.on('connection', function (socket) {
            // console.log('connections');

            socket.on('get-integrations', function () {
                console.log('get-integrations');
                var integrations = thiis.integrationsManager.currentServices();
                // console.log(services);
                socket.emit('integrations', integrations);
            });
            socket.on('get-devices', function () {
                console.log('get-devices');
                var devices = thiis.devicesManager.currentDevices();
                // console.log(services);
                socket.emit('devices', devices);
            });

            socket.on('user-send-magic-link', function (args) {
                console.log('user-send-magic-link', args.emailAddress, args.host);
                thiis.mailer.send(args.emailAddress, 'Magic link to sign-in', 'test', '<b>test</b>', (err) => {
                    console.log('callback', err);
                    if (err) {
                        socket.emit('user-magic-link-error', { error:err });
                    } else {
                        socket.emit('user-magic-link-sent', { emailAddress:args.emailAddress });
                    }
                });
            });
        });
        // let roomSocket = new RoomSocket(this.io);
    }

    /**
     * Start HTTP server listening
     *
     * @class Server
     * @method listen
     * @return void
     */
    private listen(): void {
        //listen on provided ports
        this.server.listen(this.port);

        //add error handler
        this.server.on("error", error => {
            console.log("ERROR", error);
        });

        //start listening on port
        this.server.on("listening", () => {
            console.log('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', this.port, this.port);
        });

    }
}

// Bootstrap the server
Server.bootstrap();
