import Router, { Request, Response } from "express";
import { Bouqute } from '../models/bouqute.model';
const router = Router();
router.post('/', async (req: Request, res: Response) => {
    const { title, limit, date, price, sale, socail } = req.body
    const bouqute = await new Bouqute({
        title: title,
        price: price,
        sale: sale,
        date: date,
        limit: limit,
        socail: socail
    })
    bouqute.save()
    res.status(200).send({ message: "done add socail" })
})
router.get('/get', async (req, res) => {
    const get = await Bouqute.find().populate({
        model: "socail",
        path: "socail"
    })
    res.status(200).send(get)
})
export default router
