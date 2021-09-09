import { Socail } from './../models/socail.mode';
import Router, { Request, Response } from "express";
const router = Router();
router.post('/', async (req: Request, res: Response) => {
    const { title, limit, date, price, sale, language } = req.body
    const socail = await new Socail({
        title: title,
 
        language: language
    })
    socail.save()
    res.status(200).send({message:"done add socail"})

})
router.get('/get', async (req: Request, res: Response) => {
    const socail = await Socail.find()
    res.status(200).send(socail)
})
export default router
