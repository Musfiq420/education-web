import db from "lib/mongodb";

export default async (req, res) => {
    const {course_id, title, rank} = req.body;

    console.log("course-id: "+course_id+" title: "+title);
    try {
        const chapter = await db.collection("chapters").insertOne({course:course_id, title:title, rank:rank});
        res.status(200).json(chapter);
    } catch (e) {
        console.error(e);
    }
 };