import db from "lib/mongodb";

export default async (req, res) => {
    const {chapter} = req.query;

    try {
        const lessions = await db.collection("lessions").find({chapter:chapter}).sort({rank:1}).toArray();
        console.log(lessions);
        res.status(200).json(lessions);
    } catch (e) {
        console.error(e);
    }
 };