const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const MysqlDatabase = require('./API/DATABASE/mysqldatabase');
const path = require('path');

// JWT
const MeuTokenJWT = require('./API/http/meuTokenJWT');
const JwtMiddleware = require('./API/middleware/jwtmiddleware');

// Módulos
const hospedeDAO = require('./API/DAO/hospedeDAO');
const hospedeService = require('./API/service/hospedeService');
const hospedeControl = require('./API/Controle/HospedeControl');    
const hospedeRoteador = require('./API/router/hospedeRoteador');
const hospedemiddleware = require('./API/middleware/hospedemiddleware');

const hotelDAO = require('./API/DAO/hotelDAO');
const hotelService = require('./API/service/hotelService');
const hotelControl = require('./API/Controle/hotelControl');    
const hotelRoteador = require('./API/router/hotelRoteador');
const hotelmiddleware = require('./API/middleware/hotelmiddleware');

const reservaDAO = require('./API/DAO/reservaDAO');
const reservaService = require('./API/service/reservaService');
const reservaControl = require('./API/Controle/reservaControl');    
const reservaRoteador = require('./API/router/reservaRoteador');
const reservamiddleware = require('./API/middleware/reservamiddleware');

// Auth
const AuthRoteador = require('./API/router/authRoteador');

module.exports = class Server {
    #porta;
    #app;
    #database;

    // JWT
    #jwtMiddleware;
    #meuTokenJWT;

    // Módulos
    #hospedeDAO;
    #hospedeService;
    #hospedeControl;
    #hospedeRoteador;
    #hospedemiddleware;

    #hotelDAO;
    #hotelService;
    #hotelControl;
    #hotelRoteador;
    #hotelmiddleware;
    
    #reservaDAO;
    #reservaService;
    #reservaControl;
    #reservaRoteador;
    #reservamiddleware;

    // Auth
    #authRoteador;

    constructor(porta) {
        console.log("⬆️  ServerConstructor()");
        this.#porta = porta ?? 8000;
        
        // Inicializar JWT
        this.#meuTokenJWT = new MeuTokenJWT();
        this.#jwtMiddleware = new JwtMiddleware();
    }

    init = async () => {
        console.log("⬆️  Server.init()");
        this.#app = express();
        
        // CORS
        this.#app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            credentials: true
        }));

        // JSON middleware
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));

        // Arquivos estáticos
        this.#app.use(express.static("static"));

        // Conectar ao banco
        try {
            this.#database = new MysqlDatabase({
                host: "localhost",
                user: "root",
                password: "",
                database: "casa_branca",
                port: 3306,
                waitForConnections: true,
                connectionLimit: 50,
                queueLimit: 10
            });
            
            await this.#database.connect();
            console.log("✅ Conectado ao banco de dados MySQL");
        } catch (error) {
            console.error("❌ Erro ao conectar com o banco:", error);
            throw error;
        }

        // CONFIGURAR AUTH
        await this.setupAuth();

        // Rotas
        this.#setupStaticRoutes();
        await this.setupHospede();
        await this.setupHotel();
        await this.setupReserva();

        console.log("✅ Todas as rotas configuradas");
    }

    // Configurar Auth
    setupAuth = async () => {
        console.log("⬆️  Server.setupAuth()");
        try {
            this.#authRoteador = new AuthRoteador(
                express.Router(),
                this.#database
            );
            
            this.#app.use("/api/v1/auth", this.#authRoteador.createRoutes());
            console.log("✅ Módulo Auth configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Auth:", error);
            throw error;
        }
    }

    
        #setupStaticRoutes = () => {
        console.log("⬆️  Configurando rotas estáticas...");

        // 🔹 Caminho absoluto da pasta static
        const path = require('path');
        const staticBasePath = path.resolve(
            "C:\\Users\\Ana\\Desktop\\xamp\\htdocs\\web\\API-NODEJS-MVCS-RESTFUL-CRUD-COMPLETE-FRONTEND-main\\API-NODEJS-MVCS-RESTFUL-CRUD-COMPLETE-FRONTEND-main\\API-NODEJS-MVCS-RESTFUL-CRUD-COMPLETE-FRONTEND-main\\static"
        );

        // 🔹 Servir automaticamente todos os arquivos da pasta /static
        this.#app.use(express.static(staticBasePath));

        // 🔹 Página inicial (ao acessar "/")
        this.#app.get('/', (req, res) => {
            res.sendFile(path.join(staticBasePath, 'login.html'));
        });

        console.log("✅ Rotas estáticas configuradas com sucesso");
    };


    setupHospede = async () => {
        console.log("⬆️  Server.setupHospede()");
        try {
            this.#hospedeDAO = new hospedeDAO(this.#database);
            this.#hospedeService = new hospedeService(this.#hospedeDAO);
            this.#hospedeControl = new hospedeControl(this.#hospedeService);
            this.#hospedemiddleware = new hospedemiddleware();

            this.#hospedeRoteador = new hospedeRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#hospedemiddleware,  
                this.#hospedeControl
            );
            
            this.#app.use("/api/v1/hospedes", this.#hospedeRoteador.createRoutes());
            console.log("✅ Módulo Hospede configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Hospede:", error);
            throw error;
        }
    }

    setupHotel = async () => {
        console.log("⬆️  Server.setupHotel()");
        try {
            this.#hotelDAO = new hotelDAO(this.#database);
            this.#hotelService = new hotelService(this.#hotelDAO);
            this.#hotelControl = new hotelControl(this.#hotelService);
            this.#hotelmiddleware = new hotelmiddleware();

            this.#hotelRoteador = new hotelRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#hotelmiddleware,  
                this.#hotelControl
            );
            
            this.#app.use("/api/v1/hoteis", this.#hotelRoteador.createRoutes());
            console.log("✅ Módulo Hotel configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Hotel:", error);
            throw error;
        }
    }

    setupReserva = async () => {
        console.log("⬆️  Server.setupReserva()");
        try {
            this.#reservaDAO = new reservaDAO(this.#database);
            
            if (!this.#hospedeDAO) {
                this.#hospedeDAO = new hospedeDAO(this.#database);
            }
            if (!this.#hotelDAO) {
                this.#hotelDAO = new hotelDAO(this.#database);
            }

            this.#reservaService = new reservaService(
                this.#reservaDAO, 
                this.#hospedeDAO, 
                this.#hotelDAO
            );
            
            this.#reservaControl = new reservaControl(this.#reservaService);
            this.#reservamiddleware = new reservamiddleware();

            this.#reservaRoteador = new reservaRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#reservamiddleware,
                this.#reservaControl
            );

            this.#app.use("/api/v1/reservas", this.#reservaRoteador.createRoutes());
            console.log("✅ Módulo Reserva configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Reserva:", error);
            throw error;
        }
    }

    start = () => {
        this.#app.listen(this.#porta, () => {
            console.log(`🚀 Servidor Node.js rodando na porta ${this.#porta}`);
            console.log(`🏠 Frontend: http://localhost:${this.#porta}/`);
            console.log(`📊 Dashboard: http://localhost:${this.#porta}/dashboard.html`);
            console.log(`👤 Hospedes: http://localhost:${this.#porta}/Hospedes.html`);
            console.log(`🏠 Hoteis: http://localhost:${this.#porta}/Hoteis.html`);
            console.log(`📅 Reservas: http://localhost:${this.#porta}/Reservas.html`);
            console.log(`🔐 Auth: http://localhost:${this.#porta}/api/v1/auth/login`);
            console.log(`🔗 API Hospedes: http://localhost:${this.#porta}/api/v1/hospedes`);
            console.log(`🔗 API Hoteis: http://localhost:${this.#porta}/api/v1/hoteis`);
            console.log(`🔗 API Reservas: http://localhost:${this.#porta}/api/v1/reservas`);
            console.log(`\n💡 Use: admin@casabranca.com / admin123 para testar`);
        });
    }
}