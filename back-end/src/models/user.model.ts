import { ObjectId, ObjectID } from "mongodb";
import mongoose, { Schema, disconnect, model, Model, Document } from "mongoose";
import joi, { boolean, date, number, string } from "joi";
import jwt from "jsonwebtoken";

import config from "../config/config"
//user schema  
const schema: Schema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
    unique: true,
  },
  age: {
    type: Date,
  },
  gender: {
    type: Number,
  },
  email: {
    type: String,
    maxlength: 315,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: {
    type: String,
    default: "uploads/avatar_1587657175473.png",
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 2015,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
    minlength: 11,
    maxlength: 500,
  },
  resetLink: {
    type: String,
    default: "",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "chats"
  },
  bouqute: [

    {
      name: String,
      price: Number,
      soialId: {
        type: Schema.Types.ObjectId,
        ref: "socials"
      },
    }
  ],
  activateBouqute: {
    type: Boolean
  },
  timeStart: Date,
  timeEnd: Date,
  location: {
    type: {
      type: String,

      default: "point"
    },
    coordinates: {
      type: [Number],
      require: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  }
})
export const ReantalBouquteActivated = mongoose.model(
  "users",
  schema
);
export interface Iusers extends Document {
  name: String;
  email: String;
  password: any;
  phone: String;
  gender: number;
  confirmPassword: any;
  address: String | any,
  location: any
}
schema.methods.generaToken = function (): any {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    config.JTWSecretPivate
  );
  return token;
};

export const User = mongoose.model("users", schema);
export function validateUser(user: any) {
  const schema = {
    name: joi.string().min(8).max(30).required(),
    email: joi.string().email().min(8).max(100).required(),
    phone: joi.number().min(11).required(),
    password: joi.string().min(8).max(28).required(),
    confirmPassword: joi.string().min(8).max(100).required(),
    address: joi.string().min(10).max(500).required(),
  };
  return joi.validate(user, schema);
}
export function validateUserUpdate(userUpdate: any) {
  const schema = {
    name: joi.string().min(8).max(315),
    phone: joi.number().min(11),
    address: joi.string().min(11).max(315),
    age: joi.number(),
    gender: joi.number(),
    blocked: joi.boolean(),

    password: joi.string().min(8).max(100),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateAddInformtionUser(userUpdate: any) {
  const schema = await {
    address: joi.string().min(11).max(315),
    age: joi.number(),
    gender: joi.number(),
    password: joi.string().min(8).max(100),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateUserPassword(userUpdate: any) {
  const schema = await {
    password: joi.string().min(8).max(100).required(),
    newPass: joi.string().min(8).max(100).required(),
  };
  return joi.validate(userUpdate, schema);
}
export async function vaildavatar(userUpdate: any) {
  const schema = await {
    avatar: joi.date().required(),
  };
  return joi.validate(userUpdate, schema);
}
export async function validateUserEmail(userUpdate: any) {
  const schema = await {
    email: joi.string().min(8).max(100).required(),
    password: joi.string().min(8).max(100).required(),
  };
  return joi.validate(userUpdate, schema);
}