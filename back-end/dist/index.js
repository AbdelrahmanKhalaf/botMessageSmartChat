"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const socail_router_1 = __importDefault(require("./routers/socail.router"));
const boqute_router_1 = __importDefault(require("./routers/boqute.router"));
const chat_router_1 = __importStar(require("./routers/chat.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const socket_io_1 = __importDefault(require("socket.io"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config/config"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const error_1 = require("./errors/error");
const getIDUser_1 = require("./socket/getIDUser");
const twitterApp_1 = require("./twitter/twitterApp");
const stripe = require('stripe')(config_1.default.SecretKeyPyment);
const router = express_1.Router();
mongoose_1.default
    .connect(``, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("connected to mongoDB...");
})
    .catch((err) => console.log(`Could not connect to mongoDB...${err.message}`));
const app = express_1.default();
app.set('views', path_1.default.join(__dirname, 'views'));
app.set("view engine", "ejs");
const server = http_1.default.createServer(app);
exports.io = socket_io_1.default(server);
exports.io.on("connection", (socket) => {
    getIDUser_1.getUserId(socket);
    chat_router_1.addIDuser(socket);
    twitterApp_1.USERConection(socket);
    twitterApp_1.userConection(socket);
});
app.use(morgan_1.default('dev'))
    .use(body_parser_1.default.json())
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use(cookie_parser_1.default())
    .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authentication, X-Requested-With");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})
    .use(passport_1.default.initialize())
    .use(passport_1.default.session())
    .use(express_session_1.default({ secret: config_1.default.secretSession, resave: false, saveUninitialized: false, }))
    .use(express_1.default.json())
    .use("/uploads", express_1.default.static("./uploads"))
    .use("/assets", express_1.default.static("./assets"))
    .use("/api/users", user_router_1.default)
    .use('/api/socail', socail_router_1.default)
    .use('/api/bouqute', boqute_router_1.default)
    .use('/api/chat', chat_router_1.default).use('/api/auth', auth_router_1.default)
    .use(error_1.errorHandler);
const PORT = config_1.default.port;
server.listen(PORT, () => {
    console.log(`listing now to PORT ${PORT}...`);
});
//# sourceMappingURL=index.js.map