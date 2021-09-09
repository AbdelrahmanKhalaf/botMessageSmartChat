"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bouqute_model_1 = require("../models/bouqute.model");
const router = express_1.default();
router.post('/', async (req, res) => {
    const { title, limit, date, price, sale, socail } = req.body;
    const bouqute = await new bouqute_model_1.Bouqute({
        title: title,
        price: price,
        sale: sale,
        date: date,
        limit: limit,
        socail: socail
    });
    bouqute.save();
    res.status(200).send({ message: "done add socail" });
});
router.get('/get', async (req, res) => {
    const get = await bouqute_model_1.Bouqute.find().populate({
        model: "socail",
        path: "socail"
    });
    res.status(200).send(get);
});
exports.default = router;
//# sourceMappingURL=boqute.router.js.map