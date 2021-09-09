"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const twitter_lite_1 = __importDefault(require("twitter-lite"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const twitterApp = new twitter_lite_1.default(config_1.appConfig);
const twitterUpload = new twitter_lite_1.default(config_1.appMediaConfig);
const WELCOME_IMAGE = fs_1.default.readFileSync(path_1.default.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg'));
const WELCOME_IMAGE_SIZE = fs_1.default.statSync(path_1.default.join(__dirname, './images/welcomeMessageImage/techgeekGuru.jpg')).size;
const base64Image = new Buffer(WELCOME_IMAGE).toString('base64');
const { Autohook } = require('twitter-autohook');
const webhook = new Autohook(config_1.appAutohookConfig);
function verifyCredentials() {
    return new Promise(async (resolve, reject) => {
        try {
            let resullt = twitterApp.get(`account/verify_credentials`);
            resolve(resullt);
        }
        catch (err) {
            console.log("ERORR" + err);
            reject(err);
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
(async function BotMain() {
    let verifyCredentialsResult = await verifyCredentials();
    console.log(verifyCredentialsResult);
    let initResult = await initMediaUpload();
    console.log("INIT RESULT", initResult);
    let appendResult = await appendMediaUpload(initResult.media_id_string);
    console.log("APPEND", appendResult);
    let finalizeResult = await finalizeMediaUpload(initResult.media_id_string);
    console.log("FINALIZE", finalizeResult);
    await webhook.removeWebhooks();
    webhook.on('event', function (event) {
        if (event.follow_events && event.follow_events[0].type == 'follow' && verifyCredentialsResult.id_str !== event.follow_events[0].source.id) {
            console.log(event.follow_events[0]);
        }
    });
    await webhook.start();
    var subs = await webhook.subscribe({
        oauth_token: config_1.appAutohookConfig.token,
        oauth_token_secret: config_1.appAutohookConfig.token_secret
    });
})();
//# sourceMappingURL=upload.twitter.js.map