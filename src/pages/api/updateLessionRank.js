import db from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    const {id, rank} = req.body;

    console.log(id+","+rank);
    try {
        const lession = await db.collection("lessions").updateOne(
        {_id: new ObjectId(id)}, 
        {$set: {
            rank: rank
          }},);
        res.status(200).json("ok");
    } catch (e) {
        console.error(e);
    }
 };