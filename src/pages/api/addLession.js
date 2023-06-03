import db from "lib/mongodb";

export default async (req, res) => {
    const {chapter_id, title, rank} = req.body;

    try {
        const lession = await db.collection("lessions").insertOne({chapter:chapter_id, title:title, rank:rank});
        res.status(200).json(lession);
    } catch (e) {
        console.error(e);
    }
 };