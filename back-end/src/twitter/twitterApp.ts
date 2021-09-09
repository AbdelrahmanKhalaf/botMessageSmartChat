import { appAutohookConfig, appConfig, appMediaConfig, twitter_oauth } from './config';
import Twit from "twitter-lite"
import dotenv from 'dotenv'
import path from "path"
import fs from "fs"
import { Socket } from "socket.io";
import { Chat } from '../models/chat.model';
import { Chacke } from '../helpers/search';
import { ResponseMessage } from '../helpers/search';
import _ from "lodash"
import { any } from 'joi';
import request from "request"
const twitterUpload = new Twit(appMediaConfig)


const { Autohook } = require('twitter-autohook');
export function USERConection(socket: Socket) {
    //this is name unq of room
    socket.on("conecte", (room: any) => {
        socket.join(room.userId);
        socket.to(room.userId).on("user", (id: any) => {
            console.log('from the rom ' + room.userId);

            exports.userId = ""
            exports.userId = id
        })
    });
}
// Test API is working by verifying credentials
export function verify_Credentials() {
    return new Promise(async (resolve, reject) => {
        try {
            if (exports.userId != undefined) {
                console.log(exports.userId + "user ID");
                const userId = exports.userId;
                console.log(userId);
                const querySocail = "twitter"
                const chat: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } });
                if (!chat[0]) return console.log({ error: "the user with the socail is not found" });
                appConfig.access_token_key = chat[0].social[0].acccess[0].access_token;
                appConfig.access_token_secret = chat[0].social[0].acccess[0].access_token_seacret;
                appAutohookConfig.token = chat[0].social[0].acccess[0].access_token;
                appAutohookConfig.token_secret = chat[0].social[0].acccess[0].access_token_seacret;
                const twitterApp = new Twit(appConfig)
                let resullt = await twitterApp.get(`account/verify_credentials`);
                console.log(resullt);
                resolve(resullt)
            }
        } catch (err) {
            console.log("ERORR" + err);
            reject(err)
        }
    })
}
verify_Credentials()
const webhook = new Autohook(appAutohookConfig);
const twitterApp = new Twit(appConfig)

//Let's create conection by socket 
export function userConection(socket: Socket) {
    //this is conecte user 
    socket.on("conecte", async (room: any) => {
        //join user in private room
        socket.join(room.userId);
        //send just the event to the user is conecte now in the room
        socket.to(room.userId).on("online", async (id: any) => {
            const userId = id
            const querySocail = 'twitter'
            //get detail user by id from database to chacke
            const chat: any = await Chat.find({ userId: userId }, { social: { $elemMatch: { title: querySocail } } })
            if (!chat[0]) {
                // socket.emit('error', { error: 'the user with the socail is not found' })
                console.log("Error : the user with the socail is not found");
            }
            const socail = chat[0].social[0]
            const dateNow = Date.now()
            const acsess = chat[0].social[0].acccess[0]
            const user: any = await Chat.find({ userId: userId })
            //chacke the user is date bouqute not finshed and the  socail in your database stail activate and have socail twitter      
            console.log(socail.title == querySocail);
            console.log(user[0].endDate > dateNow);
            if (socail.title == querySocail && user[0].activateChat && user[0].endDate > dateNow && acsess.access_token) {
                console.log('user activte');
                //let's go work in here 
                //Get Image Path and size
                const WELCOME_IMAGE = fs.readFileSync(path.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg'))
                const WELCOME_IMAGE_SIZE = fs.statSync(path.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg')).size;
                //verfiy access user in twiiter 
                appConfig.access_token_key = acsess.access_token;
                appConfig.access_token_secret = acsess.access_token_seacret;
                twitter_oauth.access_token_key = acsess.access_token;
                twitter_oauth.access_token_secret = acsess.access_token_seacret;
                //verfiy access user in webhook 
                appAutohookConfig.token = acsess.access_token;
                appAutohookConfig.token_secret = acsess.access_token_seacret;
                //let's go done we want 
                const webhook = new Autohook(appAutohookConfig);
                const twitterApi = new Twit(appConfig)
                //messages send to users 
                const responsesPublic: any = []
                //Let's define our functions for Media upload
                // Test API is working by verifying credentials
                function verifyCredentials() {
                    return new Promise(async (resolve, reject) => {
                        try {

                            let result = await twitterApi.get('account/verify_credentials')
                            resolve(result)
                        }
                        catch (error) {
                            console.log("ERROR", error);
                            reject(error)

                        }
                    })
                }
                //INIT Upload
                function initMediaUpload() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let result = await twitterUpload.post("media/upload", {
                                //Give parameter list
                                command: "INIT",
                                media_type: "image/jpeg",
                                total_bytes: WELCOME_IMAGE_SIZE,
                                media_category: "dm_image",
                                shared: true
                            })

                            resolve(result)
                        }
                        catch (error) {
                            reject(error);
                        }


                    })
                }
                //APPEND Upload
                function appendMediaUpload(mediaid: any) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            var buffer_length = 8000; //in bytes 
                            var buffer = new Buffer(buffer_length);
                            var bytes_sent = 0;
                            var finalResult: any;
                            // open and read video file
                            fs.open('./images/welcomeMessageImage/techgeekGuru.jpg', 'r', async function (error, file_data) {

                                var bytes_read, data,
                                    segment_index = 0,
                                    segments_completed = 0;
                                // upload video file in chunks
                                while (bytes_sent < WELCOME_IMAGE_SIZE) {

                                    console.log('APPEND' + ' bytes_read: ' + bytes_read + ' segment_index: ' + segment_index + ' segments_completed: ' + segments_completed + ' Total_image_size: ' + WELCOME_IMAGE_SIZE);
                                    bytes_read = fs.readSync(file_data, buffer, 0, buffer_length, null);
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
                                            reject(err)
                                        });

                                    bytes_sent = bytes_sent + buffer_length;
                                    segment_index = segment_index + 1;
                                    console.log('Bytes sent: ' + bytes_sent + ' buffer_length: ' + buffer_length + ' segment_index: ' + segment_index)
                                }
                                console.log('Upload chunks complete');
                                resolve(finalResult);
                            });
                        }
                        catch (error) {
                            console.log("ERROR", error)
                            reject(error);
                        }


                    })
                }

                //FINALIZE Upload
                function finalizeMediaUpload(mediaid: any) {
                    return new Promise(async (resolve, reject) => {
                        try {

                            const result = await twitterUpload.post("media/upload", {
                                command: "FINALIZE",
                                media_id: mediaid
                            })

                            resolve(result);

                        }
                        catch (error) {
                            console.log("ERROR", error)
                            reject(error)
                        }


                    })
                }
                //Mesages bot send to user 
                function response(event: any, userId: any) {
                    const responsesPrivate: Array<any> = []
                    for (let index = 0; index < event.length; index++) {
                        if (
                            event[index].recipient_id == userId) {
                            responsesPrivate.push(event[index].message)
                        }

                    }
                    return responsesPrivate
                }
                //create send message for user 
                function sendNewMessage(message: any) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const result = await twitterApi.post("direct_messages/events/new", message)
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error)
                            reject(error)
                        }


                    })
                }
                //Quick reply 
                function sendQuickReplyResponse(actions: any, requestSend: any, message: any) {
                    for (let index = 0; index < actions.length; index++) {
                        if (actions[index].title == "quick_reply") {
                            for (let o = 0; o < actions[index].action.length; o++) {
                                const element = actions[index].action[o];
                                if (requestSend == element.key) {
                                    message.event.message_create.message_data.text = element.value
                                    sendNewMessage(message)
                                    o = actions[index].action.length - 1
                                }
                            }
                        }

                    }
                }
                //create method filter send message for user 
                function message(userId: any, chat: any, messagesender: any, event: any) {
                    // /event.direct_message_events[0].message_create.sender_id
                    //event.direct_message_events[0].message_create.message_data.text
                    const actions = chat[0].social[0].actions
                    const options: any = []
                    for (let ac = 0; ac < actions.length; ac++) {
                        if (chat[0].social[0].actions[ac].title == "quick_reply") {
                            const action = chat[0].social[0].actions[ac].action
                            for (let o = 0; o < action.length; o++) {
                                const element = action[o];
                                options.push({ label: element.key, description: element.value, metadata: element.key })

                            }
                        }
                    }
                    const messageSend: any = {
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
                    }
                    const Response = response(responsesPublic, userId)
                    const messageRequest: string = messagesender
                    for (let x = 0; x < chat[0].social[0]['chatIntilagine'].length; x++) {
                        const title: String = chat[0].social[0]['chatIntilagine'][x]['title']
                        const message: any = chat[0].social[0]['chatIntilagine'][x]['samrt']
                        // if message == title will send frist message to user as a replay to your message
                        if (title.includes(messageRequest)) {
                            console.log("done without loop")
                            // chacke the response exit 
                            const response: any = chat[0].social[0].chatIntilagine[x].response.res;
                            // loop to responses bot send to users 

                            for (let i = 0; i < response.length; i++) {
                                const responseMessage = ResponseMessage(response[i], Response)
                                var stopLoop: any = false;
                                // chake the value how exited befor an if exited in array how count of the element exited befor
                                //chcke is the response send befort or not
                                if (!responseMessage) {
                                    console.log('hi');

                                    messageSend.event.message_create.message_data.text = response[i]
                                    stopLoop = true;
                                }
                                // if all responses send to user send agin any message
                                // else if (responseMessage && chacke[response[i].trim()] == 1) {
                                //     const chacke = ResponseMessage(response[i], Response)
                                //     const count = Chacke(Response)

                                //     console.log(chacke);
                                //     if (!chacke) {
                                //         messageSend.event.message_create.message_data.text = response[i]
                                //         stopLoop = true
                                //     } else if (count[response[i].trim()] == 1) {
                                //         messageSend.event.message_create.message_data.text = response[i]
                                //         stopLoop = true
                                //     }
                                // }
                                else if (i == response.length - 1) {
                                    for (let y = 0; y < response.reverse().length; y++) {
                                        const chacke = Chacke(Response)
                                        if (chacke[response[y].trim()] == undefined) {
                                            messageSend.event.message_create.message_data.text = response[y]
                                            stopLoop = true;
                                        }
                                        else if (chacke[response[y].trim()] == 1) {
                                            messageSend.event.message_create.message_data.text = response[y]
                                            stopLoop = true;
                                        }
                                    }
                                }

                                //if the response send to user more then tow once
                                if (stopLoop === true) {
                                    i = response.length - 1
                                }
                                else if (i === response.length - 1 && stopLoop === false) {
                                    messageSend.event.message_create.message_data.text = "what are you want now  "
                                }

                            }

                            x = chat[0].social[0]['chatIntilagine'].length - 1;

                        }
                        // if message == !title will useing loop to chake if the message it send == any mesaage exit in smart 
                        else if (!title.includes(messageRequest)) {
                            // chacke the message exit in the index
                            if (message.includes(messageRequest)) {
                                // chacke the response exit 
                                const response: any = chat[0].social[0].chatIntilagine[x].response.res;
                                // loop to responses bot send to users 
                                for (let i = 0; i < response.length; i++) {
                                    const responseMessage = ResponseMessage(response[i], Response)
                                    var stopLoop: any = false;
                                    // chake the value how exited befor an if exited in array how count of the element exited befor
                                    //chcke is the response send befort or not
                                    if (!responseMessage) {
                                        messageSend.event.message_create.message_data.text = response[i]
                                        stopLoop = true;
                                    }
                                    // if all responses send to user send agin any message
                                    // else if (responseMessage && chacke[response[i].trim()] == 1) {
                                    //     const chacke = ResponseMessage(response[i], Response)
                                    //     const count = Chacke(Response)

                                    //     console.log(chacke);
                                    //     if (!chacke) {
                                    //         messageSend.event.message_create.message_data.text = response[i]
                                    //         stopLoop = true
                                    //     } else if (count[response[i].trim()] == 1) {
                                    //         messageSend.event.message_create.message_data.text = response[i]
                                    //         stopLoop = true
                                    //     }
                                    // }
                                    else if (i == response.length - 1) {
                                        for (let y = 0; y < response.reverse().length; y++) {
                                            const chacke = Chacke(Response)
                                            if (chacke[response[y].trim()] == undefined) {
                                                messageSend.event.message_create.message_data.text = response[y]
                                                stopLoop = true;

                                            }
                                            else if (chacke[response[y].trim()] == 1) {
                                                messageSend.event.message_create.message_data.text = response[y]
                                                stopLoop = true;

                                            }
                                        }
                                    }

                                    //if the response send to user more then tow once
                                    if (stopLoop === true) {
                                        i = response.length - 1
                                    }
                                    else if (i === response.length - 1 && stopLoop === false) {
                                        messageSend.event.message_create.message_data.text = "what are you want now  "
                                    }

                                }

                                x = chat[0].social[0]['chatIntilagine'].length - 1;

                            }
                        }
                        else {
                            console.log('are you mean how are you ')
                        }
                    }
                    let quick_reply_response_exists = _.has(event, 'direct_message_events[0].message_create.message_data.quick_reply_response')

                    if (!quick_reply_response_exists) {
                        return sendNewMessage(messageSend)
                    }
                    if (quick_reply_response_exists) {
                        sendQuickReplyResponse(actions, event.direct_message_events[0].message_create.message_data.quick_reply_response.metadata, messageSend)
                    }
                    return;
                }
                // SendWelcomeMessage 
                function sendWelcomeMessage(recepient_id: any, name: any) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const actions = chat[0].social[0].actions
                            const options: any = []
                            for (let ac = 1; ac < actions.length; ac++) {
                                if (chat[0].social[0].actions[ac].title == "quick_reply") {
                                    const action = chat[0].social[0].actions[ac].action
                                    for (let o = 0; o < action.length; o++) {
                                        const element = action[o];
                                        options.push({ label: element.key, description: element.value, metadata: element.key })
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
                            }

                            const result = await twitterApi.post("direct_messages/events/new", message)

                            resolve(result);

                        }
                        catch (error) {
                            console.log("ERROR", error)
                            reject(error)
                        }


                    })
                }
                let verifyCredentialsResult: any = await verifyCredentials();
                console.log(verifyCredentialsResult.id_str + 'onley verify');
                var WEBHOOK_URL = 'https://amaz.sa/webhooks/twitter/'


                // // request options
                // var request_options = {
                //   url: 'https://api.twitter.com/1.1/account_activity/webhooks.json',
                //   oauth: twitter_oauth,
                //   headers: {
                //     'Content-type': 'application/x-www-form-urlencoded'
                //   },
                //   form: {
                //     url: WEBHOOK_URL
                //   }
                // }

                // // POST request to create webhook config
                // request.post(request_options, function (error, response, body) {
                //   console.log(body)
                // })
                function registerHook(url: any) {
                    return new Promise(async (resolve, reject) => {
                        const twitterApi = new Twit(twitter_oauth)
                        try {
                            const result = await twitterApi.get("account_activity/webhooks", url)
                            resolve(result);
                        }
                        catch (error) {
                            console.log("ERROR", error)
                            reject(error)
                        }

                    })
                }



                const res = await registerHook(WEBHOOK_URL)
                console.log(res);

                // Remove Existing Webhook
                // await webhook.removeWebhooks();
                // Listen to Incoming activities 
                // webhook.on('event', function (event: any) {

                //     //Here we wil add code to take action on event type = follow
                //     //check if event type is follow and useraccount id_str is not equal to my own id_str
                //     if (event.follow_events && event.follow_events[0].type == 'follow' && verifyCredentialsResult.id_str !== event.follow_events[0].source.id) {
                //         //Create a welcome message here.
                //         sendWelcomeMessage(event.follow_events[0].source.id, event.follow_events[0].source.name).then(response => {
                //             console.log("SendMessageResult " + response)
                //         })
                //             .catch(error => {
                //                 console.log(error);
                //             })

                //     }
                //     //messages come of users 
                //     if (
                //         event.direct_message_events &&
                //         event.direct_message_events[0].type == 'message_create' &&
                //         event.direct_message_events[0].message_create.sender_id !== verifyCredentialsResult.id_str
                //     ) {
                //         //Create a new message here to user .
                //         const messagedone = message(event.direct_message_events[0].message_create.sender_id, chat, event.direct_message_events[0].message_create.message_data.text, event)
                //         console.log(messagedone);

                //     }
                //     //messeges bot send to users
                //     if (
                //         event.direct_message_events &&
                //         event.direct_message_events[0].type == 'message_create' &&
                //         event.direct_message_events[0].message_create.sender_id === verifyCredentialsResult.id_str
                //     ) {
                //         //Create  meseges sent.
                //         responsesPublic.push({ message: event.direct_message_events[0].message_create.message_data.text, recipient_id: event.direct_message_events[0].message_create.target.recipient_id })
                //     }
                //     //user Sender typing 
                //     if (
                //         event.direct_message_indicate_typing_events

                //     ) {
                //         console.log(event.direct_message_indicate_typing_events + "typing");

                //     }

                // });
                // Start a server and add a new webhook
                // const webhook2 = await webhook.start();
                // console.log(webhook2);

                // var subs = await webhook.subscribe({
                //     oauth_token: appAutohookConfig.token,
                //     oauth_token_secret: appAutohookConfig.token_secret

                // });
            }
            console.log('user online' + id);
        })
    });
}