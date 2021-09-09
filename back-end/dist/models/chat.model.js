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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const schema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users"
    },
    bouquteId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "bouqutes"
    },
    activateChat: Boolean,
    endDate: Date,
    startDate: Date,
    date: Number,
    social: [
        {
            title: String,
            limit: Number,
            acccess: [{
                    access_token: String,
                    access_token_seacret: String,
                    email: String,
                    image: String,
                    name: String,
                    id_webhook: String,
                    url_webhook: String,
                    valid_webhook: String,
                    created_at: String
                }],
            actions: [
                {
                    title: String,
                    language: [{
                            type: String
                        }],
                    action: [{
                            key: {
                                type: String
                            },
                            value: String
                        }],
                }
            ],
            chatIntilagine: [{
                    title: String,
                    samrt: [{
                            type: String
                        }],
                    response: {
                        lang: { type: String },
                        res: [{
                                type: String
                            }]
                    }
                }]
        }
    ]
});
exports.Chat = mongoose_1.default.model("chats", schema);
//# sourceMappingURL=chat.model.js.map