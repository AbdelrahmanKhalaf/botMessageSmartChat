"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socail_mode_1 = require("./../models/socail.mode");
const express_1 = __importDefault(require("express"));
const router = express_1.default();
router.post('/', async (req, res) => {
    const { title, limit, date, price, sale, language } = req.body;
    const socail = await new socail_mode_1.Socail({
        title: title,
        language: language
    });
    socail.save();
    res.status(200).send({ message: "done add socail" });
});
router.get('/get', async (req, res) => {
    const socail = await socail_mode_1.Socail.find();
    res.status(200).send(socail);
});
exports.default = router;
//# sourceMappingURL=socail.router.js.map