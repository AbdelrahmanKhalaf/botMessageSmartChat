"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConection = exports.verify_Credentials = exports.USERConection = void 0;
const config_1 = require("./config");
const twitter_lite_1 = __importDefault(require("twitter-lite"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chat_model_1 = require("../models/chat.model");
const search_1 = require("../helpers/search");
const search_2 = require("../helpers/search");
const lodash_1 = __importDefault(require("lodash"));
const twitterUpload = new twitter_lite_1.default(config_1.appMediaConfig);
const { Autohook } = require('twitter-autohook');
function USERConection(socket) {
    socket.on("conecte", (room) => {
        socket.join(room.userId);
        socket.to(room.userId).on("user", (id) => {
            console.log('from the rom ' + room.userId);
            exports.userId = "";
            exports.userId = id;
        });
    });
}
exports.USERConection = USERConection;
function verify_Credentials() {
    return new Promise(async (resolve, reject) => {
        try {
            if (exports.userId != undefined) {
                console.log(exports.userId + "user ID");
                const userId = exports.userId;
                console.log(userId);
                const querySocail = "twitter";
                const chat = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
                if (!chat[0])
                    return console.log({ error: "the user with the socail is not found" });
                config_1.appConfig.access_token_key = chat[0].social[0].acccess[0].access_token;
                config_1.appConfig.access_token_secret = chat[0].social[0].acccess[0].access_token_seacret;
                config_1.appAutohookConfig.token = chat[0].social[0].acccess[0].access_token;
                config_1.appAutohookConfig.token_secret = chat[0].social[0].acccess[0].access_token_seacret;
                const twitterApp = new twitter_lite_1.default(config_1.appConfig);
                let resullt = await twitterApp.get(`account/verify_credentials`);
                console.log(resullt);
                resolve(resullt);
            }
        }
        catch (err) {
            console.log("ERORR" + err);
            reject(err);
        }
    });
}
exports.verify_Credentials = verify_Credentials;
verify_Credentials();
const webhook = new Autohook(config_1.appAutohookConfig);
const twitterApp = new twitter_lite_1.default(config_1.appConfig);
function userConection(socket) {
    socket.on("conecte", async (room) => {
        socket.join(room.userId);
        socket.to(room.userId).on("online", async (id) => {
            const userId = id;
            const querySocail = 'twitter';
            const chat = await chat_model_1.Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
            if (!chat[0]) {
                console.log("Error : the user with the socail is not found");
            }
            const socail = chat[0].social[0];
            const dateNow = Date.now();
            const acsess = chat[0].social[0].acccess[0];
            const user = await chat_model_1.Chat.find({ userId: userId });
            console.log(socail.title == querySocail);
            console.log(user[0].endDate > dateNow);
            if (socail.title == querySocail && user[0].activateChat && user[0].endDate > dateNow && acsess.access_token) {
                console.log('user activte');
                const WELCOME_IMAGE = fs_1.default.readFileSync(path_1.default.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg'));
                const WELCOME_IMAGE_SIZE = fs_1.default.statSync(path_1.default.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg')).size;
                config_1.appConfig.access_token_key = acsess.access_token;
                config_1.appConfig.access_token_secret = acsess.access_token_seacret;
                config_1.twitter_oauth.token = acsess.access_token;
                config_1.twitter_oauth.token_secret = acsess.access_token_seacret;
                config_1.appAutohookConfig.token = acsess.access_token;
                config_1.appAutohookConfig.token_secret = acsess.access_token_seacret;
                const webhook = new Autohook(config_1.appAutohookConfig);
                const twitterApi = new twitter_lite_1.default(config_1.appConfig);
                const responsesPublic = [];
                function verifyCredentials() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let result = await twitterApi.get('account/verify_credentials');
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error);
                        }
                    });
                }
                function initMediaUpload() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let result = await twitterUpload.post("media/upload", {
                                command: "INIT",
                                media_type: "image/jpeg",
                                total_bytes: WELCOME_IMAGE_SIZE,
                                media_category: "dm_image",
                                shared: true
                            });
                            resolve(result);
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                }
                function appendMediaUpload(mediaid) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            var buffer_length = 8000;
                            var buffer = new Buffer(buffer_length);
                            var bytes_sent = 0;
                            var finalResult;
                            fs_1.default.open('./images/welcomeMessageImage/techgeekGuru.jpg', 'r', async function (error, file_data) {
                                var bytes_read, data, segment_index = 0, segments_completed = 0;
                                while (bytes_sent < WELCOME_IMAGE_SIZE) {
                                    console.log('APPEND' + ' bytes_read: ' + bytes_read + ' segment_index: ' + segment_index + ' segments_completed: ' + segments_completed + ' Total_image_size: ' + WELCOME_IMAGE_SIZE);
                                    bytes_read = fs_1.default.readSync(file_data, buffer, 0, buffer_length, null);
                                    data = bytes_read < buffer_length ? buffer.slice(0, bytes_read) : buffer;
                                    var form_data = {
                                        command: 'APPEND',
                                        media_id: mediaid,
                                        segment_index: segment_index,
                                        media_data: data.toString('base64')
                                    };
                                    await twitterUpload.post("media/upload", form_data)
                                        .then(result => {
                                        segments_completed = segments_completed + 1;
                                        finalResult = result;
                                        console.log('segment_completed');
                                    })
                                        .catch(err => {
                                        reject(err);
                                    });
                                    bytes_sent = bytes_sent + buffer_length;
                                    segment_index = segment_index + 1;
                                    console.log('Bytes sent: ' + bytes_sent + ' buffer_length: ' + buffer_length + ' segment_index: ' + segment_index);
                                }
                                console.log('Upload chunks complete');
                                resolve(finalResult);
                            });
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error);
                        }
                    });
                }
                function finalizeMediaUpload(mediaid) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const result = await twitterUpload.post("media/upload", {
                                command: "FINALIZE",
                                media_id: mediaid
                            });
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error);
                        }
                    });
                }
                function response(event, userId) {
                    const responsesPrivate = [];
                    for (let index = 0; index < event.length; index++) {
                        if (event[index].recipient_id == userId) {
                            responsesPrivate.push(event[index].message);
                        }
                    }
                    return responsesPrivate;
                }
                function sendNewMessage(message) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const result = await twitterApi.post("direct_messages/events/new", message);
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error);
                        }
                    });
                }
                function sendQuickReplyResponse(actions, requestSend, message) {
                    for (let index = 0; index < actions.length; index++) {
                        if (actions[index].title == "quick_reply") {
                            for (let o = 0; o < actions[index].action.length; o++) {
                                const element = actions[index].action[o];
                                if (requestSend == element.key) {
                                    message.event.message_create.message_data.text = element.value;
                                    sendNewMessage(message);
                                    o = actions[index].action.length - 1;
                                }
                            }
                        }
                    }
                }
                function message(userId, chat, messagesender, event) {
                    const actions = chat[0].social[0].actions;
                    const options = [];
                    for (let ac = 0; ac < actions.length; ac++) {
                        if (chat[0].social[0].actions[ac].title == "quick_reply") {
                            const action = chat[0].social[0].actions[ac].action;
                            for (let o = 0; o < action.length; o++) {
                                const element = action[o];
                                options.push({ label: element.key, description: element.value, metadata: element.key });
                            }
                        }
                    }
                    const messageSend = {
                        event: {
                            type: "message_create",
                            message_create: {
                                "target": {
                                    "recipient_id": userId
                                },
                                message_data: {
                                    text: " Choose one of the options to know more",
                                    "quick_reply": {
                                        "type": "options",
                                        "options": options
                                    }
                                }
                            }
                        }
                    };
                    const Response = response(responsesPublic, userId);
                    const messageRequest = messagesender;
                    for (let x = 0; x < chat[0].social[0]['chatIntilagine'].length; x++) {
                        const title = chat[0].social[0]['chatIntilagine'][x]['title'];
                        const message = chat[0].social[0]['chatIntilagine'][x]['samrt'];
                        if (title.includes(messageRequest)) {
                            console.log("done without loop");
                            const response = chat[0].social[0].chatIntilagine[x].response.res;
                            for (let i = 0; i < response.length; i++) {
                                const responseMessage = search_2.ResponseMessage(response[i], Response);
                                var stopLoop = false;
                                if (!responseMessage) {
                                    console.log('hi');
                                    messageSend.event.message_create.message_data.text = response[i];
                                    stopLoop = true;
                                }
                                else if (i == response.length - 1) {
                                    for (let y = 0; y < response.reverse().length; y++) {
                                        const chacke = search_1.Chacke(Response);
                                        if (chacke[response[y].trim()] == undefined) {
                                            messageSend.event.message_create.message_data.text = response[y];
                                            stopLoop = true;
                                        }
                                        else if (chacke[response[y].trim()] == 1) {
                                            messageSend.event.message_create.message_data.text = response[y];
                                            stopLoop = true;
                                        }
                                    }
                                }
                                if (stopLoop === true) {
                                    i = response.length - 1;
                                }
                                else if (i === response.length - 1 && stopLoop === false) {
                                    messageSend.event.message_create.message_data.text = "what are you want now  ";
                                }
                            }
                            x = chat[0].social[0]['chatIntilagine'].length - 1;
                        }
                        else if (!title.includes(messageRequest)) {
                            if (message.includes(messageRequest)) {
                                const response = chat[0].social[0].chatIntilagine[x].response.res;
                                for (let i = 0; i < response.length; i++) {
                                    const responseMessage = search_2.ResponseMessage(response[i], Response);
                                    var stopLoop = false;
                                    if (!responseMessage) {
                                        messageSend.event.message_create.message_data.text = response[i];
                                        stopLoop = true;
                                    }
                                    else if (i == response.length - 1) {
                                        for (let y = 0; y < response.reverse().length; y++) {
                                            const chacke = search_1.Chacke(Response);
                                            if (chacke[response[y].trim()] == undefined) {
                                                messageSend.event.message_create.message_data.text = response[y];
                                                stopLoop = true;
                                            }
                                            else if (chacke[response[y].trim()] == 1) {
                                                messageSend.event.message_create.message_data.text = response[y];
                                                stopLoop = true;
                                            }
                                        }
                                    }
                                    if (stopLoop === true) {
                                        i = response.length - 1;
                                    }
                                    else if (i === response.length - 1 && stopLoop === false) {
                                        messageSend.event.message_create.message_data.text = "what are you want now  ";
                                    }
                                }
                                x = chat[0].social[0]['chatIntilagine'].length - 1;
                            }
                        }
                        else {
                            console.log('are you mean how are you ');
                        }
                    }
                    let quick_reply_response_exists = lodash_1.default.has(event, 'direct_message_events[0].message_create.message_data.quick_reply_response');
                    if (!quick_reply_response_exists) {
                        return sendNewMessage(messageSend);
                    }
                    if (quick_reply_response_exists) {
                        sendQuickReplyResponse(actions, event.direct_message_events[0].message_create.message_data.quick_reply_response.metadata, messageSend);
                    }
                    return;
                }
                function sendWelcomeMessage(recepient_id, name) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const actions = chat[0].social[0].actions;
                            const options = [];
                            for (let ac = 1; ac < actions.length; ac++) {
                                if (chat[0].social[0].actions[ac].title == "quick_reply") {
                                    const action = chat[0].social[0].actions[ac].action;
                                    for (let o = 0; o < action.length; o++) {
                                        const element = action[o];
                                        options.push({ label: element.key, description: element.value, metadata: element.key });
                                    }
                                }
                            }
                            let message = {
                                "event": {
                                    "type": "message_create",
                                    "message_create": {
                                        "target": {
                                            "recipient_id": recepient_id
                                        },
                                        "message_data": {
                                            "text": `Hey! ${name} the follow, \n Choose one of the options to know more`,
                                            "quick_reply": {
                                                "type": "options",
                                                "options": options
                                            }
                                        }
                                    }
                                }
                            };
                            const result = await twitterApi.post("direct_messages/events/new", message);
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error);
                        }
                    });
                }
                let verifyCredentialsResult = await verifyCredentials();
                console.log(verifyCredentialsResult.id_str + 'onley verify');
                var WEBHOOK_URL = 'http://localhost:3000/webhook/939532723542257665';
            }
            console.log('user online' + id);
        });
    });
}
exports.userConection = userConection;
//# sourceMappingURL=twitterApp.js.map