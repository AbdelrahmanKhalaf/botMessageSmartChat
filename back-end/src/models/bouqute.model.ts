import { ObjectId, ObjectID } from "mongodb";
import mongoose, { Schema, Model, Document } from "mongoose";
import joi, { boolean, date, number, string } from "joi";
const schema = new Schema({
    title: {
        type: String,
    },
    price: {
        type: Number
    },
    sale: {
        type: Number,
    },
    dateOut: {
        type: Date,
        default:Date.now()

    },
    limit: {
        type: Number
    },
    date: {
        type: Number
    },
    socail: [
        { type: ObjectID, ref: 'socails' }
    ],
    img:{
        type:String,
        default:"uploads/ropot.jpg"
    }
})
export const Bouqute = mongoose.model(
    "bouqute",
    schema
);