import db from "lib/mongodb";

export default async (req, res) => {
    const {course} = req.query;

    console.log("course-id: "+course);
    try {
        const chapters = await db.collection("chapters").find({course:course}).sort({rank:1}).toArray();
        console.log(chapters);
        res.status(200).json(chapters);
    } catch (e) {
        console.error(e);
    }
 };