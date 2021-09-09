import { ObjectId, ObjectID } from "mongodb";
import mongoose, { Schema, disconnect, model, Model, Document } from "mongoose";
import joi, { boolean, date, number, string } from "joi";
const schema = new Schema({
    title: {
        type: String
    },
    language: {
        type: String

    },
  
    dateOut: {
        type: Date,
        default: Date.now()
    }

})
export const Socail = mongoose.model(
    "socail",
    schema
);