import { AuthenticationMiddleware } from './../middleware/auth';
import { User } from './../models/user.model';
import { Chat } from './../models/chat.model'
import Router, { NextFunction, Request, Response } from "express"
import passport from 'passport'
import { Chacke, ResponseMessage, serchTitle } from '../helpers/search'
import Twit from "twitter-lite"
import passporttwitter from 'passport-twitter'
import config from '../config/config'
import { Bouqute } from '../models/bouqute.model'
import { Socail } from '../models/socail.mode'
import { addDays } from '../helpers/add.days'
import { Socket } from "socket.io";
import { verify_Credentials } from '../twitter/twitterApp';
import { update } from 'lodash';
import { stripeAPI } from './stripe';
const TwitterStrategy = passporttwitter.Strategy
const outh = config.oauth
const router = Router()

export async function addIDuser(socket: Socket) {
    //this is name unq of room
    socket.on("Iduser", (room: any) => {
        socket.join(room.userId);
        socket.to(room.userId).on("userDone", (id: any) => {
            exports.userId = ""
            exports.userId = id.userId
        })
    });
}
//user to rederct user to login and return token and secret token if verfiy
router.get('/twitter/login', passport.authenticate('twitter'))
//use passport with TwitterStrategy to get Outh
passport.use(
    new TwitterStrategy({
        consumerKey: config.oauth.consumer_key,
        consumerSecret: config.oauth.consumer_secret,
        callbackURL: "http://localhost:3000/api/chat/auth/twitter/callback"
    },
        async (token: any, tokenSecret: any, profile: any, done: any) => {
            const userId = exports.userId
            try {
                const querySocail = 'twitter'
                const chat: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
                if (chat[0].social[0].acccess[0] != undefined) {
                    const access: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail, acccess: { $elemMatch: { username: profile.name, email: profile.id } } } } })
                    if (access[0].social[0].acccess != undefined) {
                        console.log('you add the accsess befor');
                    } else {
                        const chat = await Chat.updateOne(
                            { userId: userId, 'social.title': querySocail },
                            {
                                $push: {
                                    "social.$.acccess": {
                                        access_token: token,
                                        access_token_seacret: tokenSecret,
                                        image: profile.photos[0].value,
                                        email: profile.id,
                                        name: profile.username
                                    }
                                }
                            }
                        )
                    }
                } else {

                    const chat = await Chat.updateOne(
                        { userId: userId, 'social.title': querySocail },
                        {
                            $push: {
                                "social.$.acccess": {
                                    access_token: token,
                                    access_token_seacret: tokenSecret,
                                    image: profile.photos[0].value,
                                    email: profile.id,
                                    name: profile.username
                                }
                            }
                        }
                    )

                }
                return done(null, profile);
            } catch (err) {
                throw err;
            }


        }
    )
)
//use socet to send id user from clinte side to save date in it table
passport.deserializeUser(function (obj, done) {
    //    console.log('Deserializing: ' + obj);
    done(null, obj);
});
passport.serializeUser(function (user, done) {
    //    console.log('Serializing: ' + JSON.stringify(user));
    done(null, user);
});

//call back form api /twitter/login 
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:4200/user/profile')
        console.log(res);

        // Successful authentication, redirect home.
        res.send(res)
    })
router.post('/addPlatform', [AuthenticationMiddleware], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bouquteId } = req.body
        const userId = res.locals.user._id
        //get caht by Id user and Id boqoute 
        const chatVA = await Chat.find({ userId: userId })
        const user = await User.find({ _id: userId })
        //get bouqute by Id for get of it contant socail to add in chat user 
        const Boqouqutes: any = await Bouqute.findById(bouquteId)
        //chcke ther user take bouqoute or not
        if (chatVA[0]) return res.status(400).send({ error_en: "you already take bouqute " })
        //chacke user 
        if (!user[0]) return res.status(400).send({ error_en: "the user not found " })
        if (!userId || !bouquteId) return res.status(400).send({ error_en: "you can take bouqute now please after login or rgister try take boqute agine " })
        // if not alredy exited caht to user create new caht to user by Id user and Id bouqute choes   
        if (!chatVA[0]) {
            const chat = new Chat({
                userId: userId,
                bouquteId: bouquteId,
            })
            chat.save();
            //loop to array socail if exited more index to update in chat user platforme want
            for (let index = 0; index < Boqouqutes.socail.length; index++) {
                //get elememnt socail
                const element = Boqouqutes.socail[index]
                //find in model database chate by socail index in loop 
                const detailsSocail: any = await Socail.find({ _id: element })
                //if the element not exited in database
                if (!detailsSocail) {
                    index = Boqouqutes.socail[index] - 1
                    return res.status(400).send("the id socail is not exited in database ")
                }
                const socail: any = await Chat.findOne({ userId: userId, bouquteId: bouquteId })
                //chacke is social add or not of not will add new
                if (socail.social) {
                    const chacke = serchTitle(detailsSocail[0].title, socail.social);
                    //chacke is platform already update in datedase or not update
                    if (!chacke) {
                        //update platform of dateBoqute user is chosse it 
                        await Chat.updateOne({ userId: userId, bouquteId: bouquteId }, {
                            $push: {
                                social: [{
                                    title: detailsSocail[0].title,
                                    limit: Boqouqutes.limit,
                                }],

                            },
                            $set: {
                                activateChat: false,
                                date: Boqouqutes.date,
                            }
                        })
                        // update the date in table user to find by user 
                        await User.update({ _id: userId }, {
                            $push: {
                                bouqute: [
                                    {
                                        name: detailsSocail[0].title,
                                        soialId: detailsSocail[0]._id,
                                        price: Boqouqutes.price
                                    }
                                ],
                            },
                            $set: {
                                activateBouqute: false

                            }

                        })
                        // update the date in table user to find by user 
                        await User.update({ _id: userId }, {
                            $set: {
                                chatId: socail._id
                            }
                        })

                    }

                } else {
                    //update platform of dateBoqute user is chosse it 
                    await Chat.updateOne({ userId: userId, bouquteId: bouquteId }, {
                        $push: {
                            social: [{
                                title: detailsSocail[0].title,
                                limit: Boqouqutes.limit,
                                actions: [
                                    {
                                        language: detailsSocail[0].language.language.map((lang: any) => {
                                            return lang.lang
                                        })
                                    }
                                ]
                            }]
                        },
                        $set: {
                            activateChat: false,
                            date: Boqouqutes.date,

                        }
                    })
                    // update the date in table user to find by user 
                    await User.update({ _id: userId }, {
                        $push: {
                            bouqute: [
                                {
                                    name: detailsSocail[0].title,
                                    soialId: detailsSocail[0]._id,
                                    price: Boqouqutes.price
                                }
                            ]
                        },
                        $set: {
                            activate: false,

                        }
                    })

                }
            }
            res.status(200).send({ message: `you success buy the bouqute Mr : ${res.locals.user.name} ` })

        }

    } catch (err) {
        if (err) {
            next(err.error_en)
        }
        return console.log(err);

    }
})
//chacke Out 
router.post('/chake', [AuthenticationMiddleware], async (req: Request, res: Response) => {
    const { line_items, customer_email, prodactId } = req.body;
    //check the user take bouqute or no 
    const bouqucte: any = await Chat.findOne({ bouquteId: prodactId, userId: res.locals.user._id })
    if (bouqucte) return res.status(400).send({ error: "you already take bouqute " })
    // check req body has line items and email 
    if (!line_items && !customer_email)
        return res.status(400).send({ error: "missing required session parmameters" })
    let sessison;
    try {
        sessison = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `http://localhost:4200/bouqute/all?session_id={CHECKOUT_SESSION_ID}&&prodactId=${prodactId}`,
            cancel_url: `http://localhost:4200/bouqute/all?error="an error in your card"`,
            shipping_address_collection: { allowed_countries: ['GB', 'US', "EG"] }
        })
        return res.status(200).send({ sessionId: sessison.id })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "an error occured , unable to create session" });
    }
    return;
})
router.put('/updatePlatform', async (req, res) => {
    try {
        const { value, userId } = req.body
        const user = await User.findById(userId)
        console.log(value);

        if (!user) return res.status(404).send({ error_en: "the user not found with the ID" })
        if (value == 'false') return res.status(400).send({ error: "change value to yes if want accept the user" })
        if (value == 'true') {
            const chat: any = await Chat.find({ userId: userId })
            if (!chat) return res.status(404).send({ error_en: "the chat not found with the ID User " })
            const DateNow: any = Date.now()
            const date = new Date(DateNow)
            const EndDate = addDays(date, chat[0].date)
            const updateUser = await User.updateOne({ _id: userId }, {
                $set: {
                    timeStart: DateNow,
                    timeEnd: EndDate,
                    activateBouqute: true
                }
            })
            const updateChat = await Chat.updateOne({ userId: userId }, {
                $set: {
                    endDate: EndDate,
                    startDate: DateNow,
                    activateChat: true
                }
            })

            return res.status(200).send({ message: "you has accepted the user" })
        }


        return;
    } catch (err: any) {
        return console.log(`ERROR : ${err}`);

    }
})
//update informtion in platform in database to user
router.put('/updatePlatform', async (req, res) => {
    const { } = req.body
    const userId = '60f988ca775574224c41df75'
    const chat: any = await Chat.update(
        { userId: userId },
        {
            Socail: { platform: { title: req.body.name } }
        }
    )
    res.send(chat)
})
//to send replay to user 
router.get('/get', async (req, res) => {
    const messageRequest: string = req.body.message
    console.log()

    const chat: any = await Chat.find().populate({
        model: "bouquteId userId",
        path: "bouqutes users"
    })
    const Response: any = [
        "i am fine and you",
        "weclome",
        "haapy too",
        "i am fine and you",
        "weclome",
        "haapy too",
        "i am fine and you",
        "i am fine and you",
        "weclome",
        "weclome",
        "haapy too",
        "haapy too",

    ]


    for (let x = 0; x < chat[0].social[0]['chatIntilagine'].length; x++) {
        const title: String = chat[0].social[0]['chatIntilagine'][x]['title']
        const message: any = chat[0].social[0]['chatIntilagine'][x]['samrt']
        // if message == title will send frist message to user as a replay to your message
        if (title.includes(messageRequest)) {
            console.log("done without loop")
            // chacke the response exit 
            const response: any = chat[0].social[0].chatIntilagine[x].response.res;
            // loop to responses from datebse 
            for (let i = 0; i < response.length; i++) {
                const responseMessage = ResponseMessage(response[i], Response)
                var stopLoop: any = false;
                // chake the value how exited befor an if exited in array how count of the element exited befor
                const chacke = Chacke(Response)
                console.log(chacke[response[i].trim()]);

                //chcke is the response send befort or not
                if (!responseMessage) {
                    Response.push(response[i])
                    res.status(200).send(response[i])
                    stopLoop = true;
                }
                // if all responses send to user send agin any message
                else if (responseMessage && chacke[response[i].trim()] == 1) {
                    const chacke = ResponseMessage(response[i], Response)
                    console.log(chacke);

                    if (!chacke) {
                        res.status(200).send(response[i])
                        Response.push(response[i])
                    } else {
                        res.status(200).send(response[i])
                        stopLoop = true;
                    }
                }
                //if the response send to user more then tow once
                else if (responseMessage && chacke[response[i].trim()] <= 3 && stopLoop === false) {
                    for (let index = 0; index < response.length; index++) {
                        if (chacke[response[index].trim()] <= 3) {
                            res.status(200).send(response[index])
                            index = response.length - 1
                        }
                    }
                    stopLoop = true;
                }
                if (stopLoop === true) {
                    i = response.length - 1
                }
                else if (i === response.length - 1 && stopLoop === false) {
                    res.status(200).send('are you want complate the conv')
                }

            }
            x = chat[0].social[0]['chatIntilagine'].length - 1;

        }
        // if message == !title will useing loop to chake if the message it send == any mesaage exit in smart 
        else if (!title.includes(messageRequest)) {
            // chacke the message exit in the index
            for (let index = 0; index < message.length; index++) {
                const element: String = message[index].valueOf()
                // if true will send respons as replay to user and chacke the response not send befor 
                if (
                    element.includes(messageRequest.toLocaleLowerCase())
                ) {
                    index = message.length - 1;
                    // response of database to replay to user 
                    const response: any = chat[0].social[0].chatIntilagine[x].response.res
                    // loop to responses from datebse 
                    for (let i = 0; i < response.length; i++) {
                        const responseMessage = ResponseMessage(response[i], Response)
                        var stopLoop: any = false;
                        // chake the value how number of value exited befor an if exited in array how count of the element exited befor
                        const chacke = Chacke(Response)
                        //chcke is the response send befort or not
                        if (!responseMessage) {
                            res.status(200).send(response[i])
                            stopLoop = true;
                        }
                        // if all responses send to user send agin any message
                        else if (responseMessage && chacke[response[i].trim()] == 1) {
                            const chacke = ResponseMessage(response[i], Response)
                            res.status(200).send(response[i])
                            stopLoop = true;

                        }
                        //if the response send to user more then tow once
                        else if (responseMessage && chacke[response[i].trim()] < 3 && stopLoop === false) {
                            res.status(200).send(response[i])
                            stopLoop = true;
                        }
                        if (stopLoop === true) {
                            i = response.length - 1
                        }
                        else if (i === response.length - 1 && stopLoop === false) {
                            res.status(200).send('are you want complate the conv')
                        }

                    }
                    // if (Response.length == 0) {
                    //     res.status(200).send(response)
                    // } else if (Response.length != 0) {

                    // }
                    x = chat[0].social[0]['chatIntilagine'].length - 1;
                }
            }
        }
        else {
            res.send('wrong tipe agine')
            console.log('are you mean how are you ')
        }
    }




    // res.status(200).send(
    //     {
    //         titleInt: chat[0].social.platform[0]['chatIntilagine'][0]['title'],
    //         smart: chat[0].social.platform[0]['chatIntilagine'][0]['smart'],

    //     })

})
//add more socail to bouqute select the boqoute by ID
router.post('/addSocail', async (req, res) => {
    const { id, socailId } = req.body
    const update = await Bouqute.updateOne({ _id: id }, {
        $push: {
            socail: socailId
        }
    })
    console.log(update)
    res.send('done')

})
//get infromtion user from twitter
router.get("/info", async (req, res) => {
    try {
        const resullt = await verify_Credentials()
        return res.status(200).send(resullt)
    } catch (err) {
        return res.send(err)
    }
})
//add smart chat intelligent 
router.post('/addSmart/:id', async (req: Request, res: Response) => {
    try {
        const { title, value, lang, message } = req.body
        // id user in token in header 
        const userId = req.params.id;
        console.log(userId);

        //title of socail i want samrted chat 
        const querySocail = "twitter"
        //title chatIntligant in socail selected by params 
        const queryacTitleChat = "hello"
        //get the user i want smarted his chat and get platform i want do that in it 
        const chatWithUserWithSocail: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        if (!chatWithUserWithSocail[0]) return res.status(400).send({ error: "the user with the socail is not found" });
        //chake if is title will add exited in smart chat not add just have add a new title
        const chackeTitle = serchTitle(title, chatWithUserWithSocail[0].social[0].chatIntilagine)
        if (chackeTitle) return res.status(400).send({ error: "the title already add " });
        await Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $push: {
                'social.$.chatIntilagine': [
                    {
                        title: title,
                        samrt: value.map((val: any) => {
                            return val
                        })
                        ,
                        response: {
                            lang: lang,
                            res: message.map((mes: any) => {
                                return mes
                            })
                        }
                    }
                ]
            }
        })
        // get a new add in chat user to send it to user 
        // const chat = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        return res.status(200).send({ success: true, message: "you has added to user new chat" })
    } catch (err) {
        res.send(err)

        return console.log(err);
    }

})
//delet one of smart chat intelligent 
router.put('/deleteSmart/:id', async (req: Request, res: Response) => {
    try {
        const { title } = req.body
        // id user in token in header 
        const userId = req.params.id;
        //title of socail i want samrted chat 
        const querySocail = "twitter"
        //title chatIntligant in socail selected by params 
        const queryacTitleChat = "hello"
        //get the user i want smarted his chat and get platform i want do that in it 
        const chatWithUserWithSocail: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        if (!chatWithUserWithSocail[0]) return res.status(400).send({ error: "the user with the socail is not found" });
        await Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $pull: {
                'social.$.chatIntilagine':
                {
                    title: title,

                }

            }


        })
        // get a new add in chat user to send it to user 
        // const chat = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        return res.status(200).send({ success: true, message: "you has added to user new chat" })
    } catch (err) {
        res.send(err)
        return console.log(err);
    }
})
//add action to chat user 
router.post('/addAction/:id', async (req: Request, res: Response) => {
    try {
        const { action, lang, title } = req.body
        // id user in token in header 
        const userId = req.params.id;
        //title of socail i want samrted chat 
        const querySocail = "twitter"
        //title chatIntligant in socail selected by params 
        const queryacTitleChat = "hello"
        //get the user i want smarted his chat and get platform i want do that in it 
        const chatWithUserWithSocail: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        if (!chatWithUserWithSocail[0]) return res.status(400).send({ error: "the user with the socail is not found" });
        //chake if is title will add exited in smart chat not add just have add a new title
        // const chackeTitle = serchTitle(title, chatWithUserWithSocail[0].social[0].actions[0])
        // if (chackeTitle) return res.status(400).send({ error: "the title already add " });
        console.log(action);

        await Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $push: {
                'social.$.actions': [
                    {
                        title: title,
                        language: lang,
                        action: action.map((attribute: any) => {
                            return {
                                key: attribute.key,
                                value: attribute.value,
                            };
                        }),

                    }
                ]
            }
        })
        // get a new add in chat user to send it to user 
        return res.status(200).send({ success: true, message: "you has added to user new action" })
    } catch (err) {
        res.send(err)

        return console.log(err);
    }
})
//delet one of action 
router.put('/deleteAction/:id', async (req: Request, res: Response) => {
    try {
        const { action, lang, title } = req.body
        // id user in token in header 
        const userId = req.params.id;
        //title of socail i want samrted chat 
        const querySocail = "twitter"
        //title chatIntligant in socail selected by params 
        const queryacTitleChat = "hello"
        //get the user i want smarted his chat and get platform i want do that in it 
        const chatWithUserWithSocail: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
        //chake if is title will add exited in smart chat not add just have add a new title
        // const chackeTitle = serchTitle(title, chatWithUserWithSocail[0].social[0].actions[0])
        // if (chackeTitle) return res.status(400).send({ error: "the title already add " });
        await Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $pull: {
                'social.$.actions':
                {
                    title: title,
                }

            }
        })
        // get a new add in chat user to send it to user 
        return res.status(200).send({ success: true, message: "you has added to user new action" })
    } catch (err) {
        res.send(err)

        return console.log(err);
    }
})
//get caht by id user 
router.get('/getChat', [AuthenticationMiddleware], async (req: Request, res: Response) => {
    const userId = res.locals.user._id
    const chatByIdUser = await Chat.find({ userId: userId })
    if (!chatByIdUser[0]) res.status(400).send({ error_en: "YOU DOUNT HAVE ANY SOCAIL FOR NOW" })
    if (chatByIdUser[0]) res.status(200).send({ chat: chatByIdUser[0] })
})

router.get('/getChat/admin/:id', [AuthenticationMiddleware], async (req: Request, res: Response) => {
    const userId = req.params.id
    const chatByIdUser = await Chat.find({ userId: userId })
    if (!chatByIdUser[0]) res.status(400).send({ error_en: "THE USER DOSE NOT HAVE ANY SOCAIL FOR NOW" })
    if (chatByIdUser[0]) res.status(200).send({ chat: chatByIdUser[0] })
})
//60f988ca775574224c41df75
export default router
