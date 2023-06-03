import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id, title} = req.body;
    try {
        const lession = await db.collection("lessions").updateOne(
            {_id: new ObjectId(id)},
            {$set:{title:title}}
        )
        res.status(200).json(lession);
    } catch (e) {
        console.error(e);
    }
 };