"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIDuser = void 0;
const auth_1 = require("./../middleware/auth");
const user_model_1 = require("./../models/user.model");
const chat_model_1 = require("./../models/chat.model");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const search_1 = require("../helpers/search");
const passport_twitter_1 = __importDefault(require("passport-twitter"));
const config_1 = __importDefault(require("../config/config"));
const bouqute_model_1 = require("../models/bouqute.model");
const socail_mode_1 = require("../models/socail.mode");
const add_days_1 = require("../helpers/add.days");
const twitterApp_1 = require("../twitter/twitterApp");
const stripe_1 = require("./stripe");
const TwitterStrategy = passport_twitter_1.default.Strategy;
const outh = config_1.default.oauth;
const router = express_1.default();
async function addIDuser(socket) {
    socket.on("Iduser", (room) => {
        socket.join(room.userId);
        socket.to(room.userId).on("userDone", (id) => {
            exports.userId = "";
            exports.userId = id.userId;
        });
    });
}
exports.addIDuser = addIDuser;
router.get('/twitter/login', passport_1.default.authenticate('twitter'));
passport_1.default.use(new TwitterStrategy({
    consumerKey: config_1.default.oauth.consumer_key,
    consumerSecret: config_1.default.oauth.consumer_secret,
    callbackURL: "http://localhost:3000/api/chat/auth/twitter/callback"
}, async (token, tokenSecret, profile, done) => {
    const userId = exports.userId;
    try {
        const querySocail = 'twitter';
        const chat = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
        if (chat[0].social[0].acccess[0] != undefined) {
            const access = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail, acccess: { $elemMatch: { username: profile.name, email: profile.id } } } } });
            if (access[0].social[0].acccess != undefined) {
                console.log('you add the accsess befor');
            }
            else {
                const chat = await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
                    $push: {
                        "social.$.acccess": {
                            access_token: token,
                            access_token_seacret: tokenSecret,
                            image: profile.photos[0].value,
                            email: profile.id,
                            name: profile.username
                        }
                    }
                });
            }
        }
        else {
            const chat = await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
                $push: {
                    "social.$.acccess": {
                        access_token: token,
                        access_token_seacret: tokenSecret,
                        image: profile.photos[0].value,
                        email: profile.id,
                        name: profile.username
                    }
                }
            });
        }
        return done(null, profile);
    }
    catch (err) {
        throw err;
    }
}));
passport_1.default.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
router.get('/auth/twitter/callback', passport_1.default.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
    res.redirect('http://localhost:4200/user/profile');
    console.log(res);
    res.send(res);
});
router.post('/addPlatform', [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    try {
        const { bouquteId } = req.body;
        const userId = res.locals.user._id;
        const chatVA = await chat_model_1.Chat.find({ userId: userId });
        const user = await user_model_1.User.find({ _id: userId });
        const Boqouqutes = await bouqute_model_1.Bouqute.findById(bouquteId);
        if (chatVA[0])
            return res.status(400).send({ error_en: "you already take bouqute " });
        if (!user[0])
            return res.status(400).send({ error_en: "the user not found " });
        if (!userId || !bouquteId)
            return res.status(400).send({ error_en: "you can take bouqute now please after login or rgister try take boqute agine " });
        if (!chatVA[0]) {
            const chat = new chat_model_1.Chat({
                userId: userId,
                bouquteId: bouquteId,
            });
            chat.save();
            for (let index = 0; index < Boqouqutes.socail.length; index++) {
                const element = Boqouqutes.socail[index];
                const detailsSocail = await socail_mode_1.Socail.find({ _id: element });
                if (!detailsSocail) {
                    index = Boqouqutes.socail[index] - 1;
                    return res.status(400).send("the id socail is not exited in database ");
                }
                const socail = await chat_model_1.Chat.findOne({ userId: userId, bouquteId: bouquteId });
                if (socail.social) {
                    const chacke = search_1.serchTitle(detailsSocail[0].title, socail.social);
                    if (!chacke) {
                        await chat_model_1.Chat.updateOne({ userId: userId, bouquteId: bouquteId }, {
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
                        });
                        await user_model_1.User.update({ _id: userId }, {
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
                        });
                        await user_model_1.User.update({ _id: userId }, {
                            $set: {
                                chatId: socail._id
                            }
                        });
                    }
                }
                else {
                    await chat_model_1.Chat.updateOne({ userId: userId, bouquteId: bouquteId }, {
                        $push: {
                            social: [{
                                    title: detailsSocail[0].title,
                                    limit: Boqouqutes.limit,
                                    actions: [
                                        {
                                            language: detailsSocail[0].language.language.map((lang) => {
                                                return lang.lang;
                                            })
                                        }
                                    ]
                                }]
                        },
                        $set: {
                            activateChat: false,
                            date: Boqouqutes.date,
                        }
                    });
                    await user_model_1.User.update({ _id: userId }, {
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
                    });
                }
            }
            res.status(200).send({ message: `you success buy the bouqute Mr : ${res.locals.user.name} ` });
        }
    }
    catch (err) {
        if (err) {
            next(err.error_en);
        }
        return console.log(err);
    }
});
router.post('/chake', [auth_1.AuthenticationMiddleware], async (req, res) => {
    const { line_items, customer_email, prodactId } = req.body;
    const bouqucte = await chat_model_1.Chat.findOne({ bouquteId: prodactId, userId: res.locals.user._id });
    if (bouqucte)
        return res.status(400).send({ error: "you already take bouqute " });
    if (!line_items && !customer_email)
        return res.status(400).send({ error: "missing required session parmameters" });
    let sessison;
    try {
        sessison = await stripe_1.stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `http://localhost:4200/bouqute/all?session_id={CHECKOUT_SESSION_ID}&&prodactId=${prodactId}`,
            cancel_url: `http://localhost:4200/bouqute/all?error="an error in your card"`,
            shipping_address_collection: { allowed_countries: ['GB', 'US', "EG"] }
        });
        return res.status(200).send({ sessionId: sessison.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "an error occured , unable to create session" });
    }
    return;
});
router.put('/updatePlatform', async (req, res) => {
    try {
        const { value, userId } = req.body;
        const user = await user_model_1.User.findById(userId);
        console.log(value);
        if (!user)
            return res.status(404).send({ error_en: "the user not found with the ID" });
        if (value == 'false')
            return res.status(400).send({ error: "change value to yes if want accept the user" });
        if (value == 'true') {
            const chat = await chat_model_1.Chat.find({ userId: userId });
            if (!chat)
                return res.status(404).send({ error_en: "the chat not found with the ID User " });
            const DateNow = Date.now();
            const date = new Date(DateNow);
            const EndDate = add_days_1.addDays(date, chat[0].date);
            const updateUser = await user_model_1.User.updateOne({ _id: userId }, {
                $set: {
                    timeStart: DateNow,
                    timeEnd: EndDate,
                    activateBouqute: true
                }
            });
            const updateChat = await chat_model_1.Chat.updateOne({ userId: userId }, {
                $set: {
                    endDate: EndDate,
                    startDate: DateNow,
                    activateChat: true
                }
            });
            return res.status(200).send({ message: "you has accepted the user" });
        }
        return;
    }
    catch (err) {
        return console.log(`ERROR : ${err}`);
    }
});
router.put('/updatePlatform', async (req, res) => {
    const {} = req.body;
    const userId = '60f988ca775574224c41df75';
    const chat = await chat_model_1.Chat.update({ userId: userId }, {
        Socail: { platform: { title: req.body.name } }
    });
    res.send(chat);
});
router.get('/get', async (req, res) => {
    const messageRequest = req.body.message;
    console.log();
    const chat = await chat_model_1.Chat.find().populate({
        model: "bouquteId userId",
        path: "bouqutes users"
    });
    const Response = [
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
    ];
    for (let x = 0; x < chat[0].social[0]['chatIntilagine'].length; x++) {
        const title = chat[0].social[0]['chatIntilagine'][x]['title'];
        const message = chat[0].social[0]['chatIntilagine'][x]['samrt'];
        if (title.includes(messageRequest)) {
            console.log("done without loop");
            const response = chat[0].social[0].chatIntilagine[x].response.res;
            for (let i = 0; i < response.length; i++) {
                const responseMessage = search_1.ResponseMessage(response[i], Response);
                var stopLoop = false;
                const chacke = search_1.Chacke(Response);
                console.log(chacke[response[i].trim()]);
                if (!responseMessage) {
                    Response.push(response[i]);
                    res.status(200).send(response[i]);
                    stopLoop = true;
                }
                else if (responseMessage && chacke[response[i].trim()] == 1) {
                    const chacke = search_1.ResponseMessage(response[i], Response);
                    console.log(chacke);
                    if (!chacke) {
                        res.status(200).send(response[i]);
                        Response.push(response[i]);
                    }
                    else {
                        res.status(200).send(response[i]);
                        stopLoop = true;
                    }
                }
                else if (responseMessage && chacke[response[i].trim()] <= 3 && stopLoop === false) {
                    for (let index = 0; index < response.length; index++) {
                        if (chacke[response[index].trim()] <= 3) {
                            res.status(200).send(response[index]);
                            index = response.length - 1;
                        }
                    }
                    stopLoop = true;
                }
                if (stopLoop === true) {
                    i = response.length - 1;
                }
                else if (i === response.length - 1 && stopLoop === false) {
                    res.status(200).send('are you want complate the conv');
                }
            }
            x = chat[0].social[0]['chatIntilagine'].length - 1;
        }
        else if (!title.includes(messageRequest)) {
            for (let index = 0; index < message.length; index++) {
                const element = message[index].valueOf();
                if (element.includes(messageRequest.toLocaleLowerCase())) {
                    index = message.length - 1;
                    const response = chat[0].social[0].chatIntilagine[x].response.res;
                    for (let i = 0; i < response.length; i++) {
                        const responseMessage = search_1.ResponseMessage(response[i], Response);
                        var stopLoop = false;
                        const chacke = search_1.Chacke(Response);
                        if (!responseMessage) {
                            res.status(200).send(response[i]);
                            stopLoop = true;
                        }
                        else if (responseMessage && chacke[response[i].trim()] == 1) {
                            const chacke = search_1.ResponseMessage(response[i], Response);
                            res.status(200).send(response[i]);
                            stopLoop = true;
                        }
                        else if (responseMessage && chacke[response[i].trim()] < 3 && stopLoop === false) {
                            res.status(200).send(response[i]);
                            stopLoop = true;
                        }
                        if (stopLoop === true) {
                            i = response.length - 1;
                        }
                        else if (i === response.length - 1 && stopLoop === false) {
                            res.status(200).send('are you want complate the conv');
                        }
                    }
                    x = chat[0].social[0]['chatIntilagine'].length - 1;
                }
            }
        }
        else {
            res.send('wrong tipe agine');
            console.log('are you mean how are you ');
        }
    }
});
router.post('/addSocail', async (req, res) => {
    const { id, socailId } = req.body;
    const update = await bouqute_model_1.Bouqute.updateOne({ _id: id }, {
        $push: {
            socail: socailId
        }
    });
    console.log(update);
    res.send('done');
});
router.get("/info", async (req, res) => {
    try {
        const resullt = await twitterApp_1.verify_Credentials();
        return res.status(200).send(resullt);
    }
    catch (err) {
        return res.send(err);
    }
});
router.post('/addSmart/:id', async (req, res) => {
    try {
        const { title, value, lang, message } = req.body;
        const userId = req.params.id;
        console.log(userId);
        const querySocail = "twitter";
        const queryacTitleChat = "hello";
        const chatWithUserWithSocail = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
        if (!chatWithUserWithSocail[0])
            return res.status(400).send({ error: "the user with the socail is not found" });
        const chackeTitle = search_1.serchTitle(title, chatWithUserWithSocail[0].social[0].chatIntilagine);
        if (chackeTitle)
            return res.status(400).send({ error: "the title already add " });
        await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $push: {
                'social.$.chatIntilagine': [
                    {
                        title: title,
                        samrt: value.map((val) => {
                            return val;
                        }),
                        response: {
                            lang: lang,
                            res: message.map((mes) => {
                                return mes;
                            })
                        }
                    }
                ]
            }
        });
        return res.status(200).send({ success: true, message: "you has added to user new chat" });
    }
    catch (err) {
        res.send(err);
        return console.log(err);
    }
});
router.put('/deleteSmart/:id', async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.params.id;
        const querySocail = "twitter";
        const queryacTitleChat = "hello";
        const chatWithUserWithSocail = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
        if (!chatWithUserWithSocail[0])
            return res.status(400).send({ error: "the user with the socail is not found" });
        await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $pull: {
                'social.$.chatIntilagine': {
                    title: title,
                }
            }
        });
        return res.status(200).send({ success: true, message: "you has added to user new chat" });
    }
    catch (err) {
        res.send(err);
        return console.log(err);
    }
});
router.post('/addAction/:id', async (req, res) => {
    try {
        const { action, lang, title } = req.body;
        const userId = req.params.id;
        const querySocail = "twitter";
        const queryacTitleChat = "hello";
        const chatWithUserWithSocail = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
        if (!chatWithUserWithSocail[0])
            return res.status(400).send({ error: "the user with the socail is not found" });
        console.log(action);
        await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $push: {
                'social.$.actions': [
                    {
                        title: title,
                        language: lang,
                        action: action.map((attribute) => {
                            return {
                                key: attribute.key,
                                value: attribute.value,
                            };
                        }),
                    }
                ]
            }
        });
        return res.status(200).send({ success: true, message: "you has added to user new action" });
    }
    catch (err) {
        res.send(err);
        return console.log(err);
    }
});
router.put('/deleteAction/:id', async (req, res) => {
    try {
        const { action, lang, title } = req.body;
        const userId = req.params.id;
        const querySocail = "twitter";
        const queryacTitleChat = "hello";
        const chatWithUserWithSocail = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
        await chat_model_1.Chat.updateOne({ userId: userId, 'social.title': querySocail }, {
            $pull: {
                'social.$.actions': {
                    title: title,
                }
            }
        });
        return res.status(200).send({ success: true, message: "you has added to user new action" });
    }
    catch (err) {
        res.send(err);
        return console.log(err);
    }
});
router.get('/getChat', [auth_1.AuthenticationMiddleware], async (req, res) => {
    const userId = res.locals.user._id;
    const chatByIdUser = await chat_model_1.Chat.find({ userId: userId });
    if (!chatByIdUser[0])
        res.status(400).send({ error_en: "YOU DOUNT HAVE ANY SOCAIL FOR NOW" });
    if (chatByIdUser[0])
        res.status(200).send({ chat: chatByIdUser[0] });
});
router.get('/getChat/admin/:id', [auth_1.AuthenticationMiddleware], async (req, res) => {
    const userId = req.params.id;
    const chatByIdUser = await chat_model_1.Chat.find({ userId: userId });
    if (!chatByIdUser[0])
        res.status(400).send({ error_en: "THE USER DOSE NOT HAVE ANY SOCAIL FOR NOW" });
    if (chatByIdUser[0])
        res.status(200).send({ chat: chatByIdUser[0] });
});
exports.default = router;
//# sourceMappingURL=chat.router.js.map