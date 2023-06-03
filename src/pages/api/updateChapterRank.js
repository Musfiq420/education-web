import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id, rank} = req.body;

    console.log(id+","+rank);
    try {
        const chapter = await db.collection("chapters").updateOne(
        {_id: new ObjectId(id)}, 
        {$set: {
            rank: rank
          }},);
        res.status(200).json("ok");
    } catch (e) {
        console.error(e);
    }
 };