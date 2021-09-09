import config from "../config/config";
export const stripeAPI = require("stripe")(config.secreteKeyStripe)