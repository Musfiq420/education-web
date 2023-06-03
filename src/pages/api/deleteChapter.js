import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id} = req.body;
    try {
        const chapter = await db.collection("chapters").deleteOne(
        {_id: new ObjectId(id)}
    );
        res.status(200).json("ok");
    } catch (e) {
        console.error(e);
    }
 };