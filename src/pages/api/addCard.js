import db from "lib/mongodb";

export default async (req, res) => {
    const {lession_id, type, data, rank} = req.body;

    try {
        const card = await db.collection("cards").insertOne({lession:lession_id, type:type, data:data, rank:rank});
        res.status(200).json(card);
    } catch (e) {
        console.error(e);
    }
 };