import db from "lib/mongodb";

export default async (req, res) => {
    const {lession} = req.query;
    console.log(lession);
    try {
        const cards = await db.collection("cards").find({lession:lession}).sort({rank:1}).toArray();
        console.log(cards);
        res.status(200).json(cards);
    } catch (e) {
        console.error(e);
    }
 };