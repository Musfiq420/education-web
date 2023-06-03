import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id, title} = req.body;
    console.log("chp_title: "+title);
    try {
        const chapter = await db.collection("chapters").updateOne(
            {_id: new ObjectId(id)},
            {$set:{title:title}}
        )
        res.status(200).json(chapter);
    } catch (e) {
        console.error(e);
    }
 };