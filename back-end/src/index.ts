import express, { Application, Router } from "express";
import path from "path";
import mongoose from "mongoose";
import users from "./routers/user.router";
import socail from './routers/socail.router'
import bouqute from './routers/boqute.router'
import chat, { addIDuser } from './routers/chat.router'
import auth from './routers/auth.router'
import socketIo, { Socket } from "socket.io";
import bodyParser from "body-parser";
import http from "http";
import config from "./config/config";
import cros from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import colors from "colors"
import passport from 'passport'
import { errorHandler } from "./errors/error"
import { getUserId } from "./socket/getIDUser";
import { userConection, USERConection } from "./twitter/twitterApp";
const stripe = require('stripe')(config.SecretKeyPyment)
const router: Router = Router()
mongoose
  .connect(
    ``,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to mongoDB...");
  })
  .catch((err) => console.log(`Could not connect to mongoDB...${err.message}`));
const app: Application = express();
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")
const server = http.createServer(app);
export const io: any = socketIo(server);
// Start Socket
io.on("connection", (socket: Socket) => {
  getUserId(socket)
  addIDuser(socket)
  USERConection(socket)
  userConection(socket)
})
// end Socket
app.use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authentication, X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Allow-Origin", "*"
    )
    next();
  })
  .use(passport.initialize())
  .use(passport.session())
  .use(session({ secret: config.secretSession, resave: false, saveUninitialized: false, }))
  .use(express.json())
  .use("/uploads", express.static("./uploads"))
  .use("/assets", express.static("./assets"))
  .use("/api/users", users)
  .use('/api/socail', socail)
  .use('/api/bouqute', bouqute)
  .use('/api/chat', chat).use
  ('/api/auth', auth)

  .use(errorHandler)
const PORT: any = config.port
server.listen(PORT, () => {
  console.log(`listing now to PORT ${PORT}...`);
});
// process.on('unhandelRejection', (err, promise) => {
//   console.log(`Error : ${err.message}`);
//   //close server & exit process
//   server.close(() => process.exit(1))
// })
/// becrypt.compare => to Comparison encrypt
