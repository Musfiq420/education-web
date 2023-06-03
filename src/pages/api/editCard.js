import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id, type, data} = req.body;

    try {
        const card = await db.collection("cards").updateOne(
            {_id: new ObjectId(id)}, 
            {$set:{type:type, data:data}}
        );
        res.status(200).json(card);
    } catch (e) {
        console.error(e);
    }
};