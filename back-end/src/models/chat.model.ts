import { ObjectId, ObjectID } from "mongodb";
import mongoose, { Schema, disconnect, model, Model, Document } from "mongoose";
import joi, { boolean, date, number, string } from "joi";
import jwt from "jsonwebtoken";

const schema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    bouquteId: {
        type: Schema.Types.ObjectId,
        ref: "bouqutes"
    },
    activateChat: Boolean,
    endDate: Date,
    startDate: Date,
    date: Number,
    social: [
        {
            //will get some detail of bouqute the clinte will choess
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
                        type:
                            String
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
                response:
                {
                    lang: { type: String },
                    res: [{

                        type: String

                    }]
                }
            }]
        }
    ]
})

export const Chat = mongoose.model(
    "chats",
    schema
);
