import db from "lib/mongodb";

export default async (req, res) => {
    try {
        const courses = await db.collection("courses").find({}).toArray();
        // console.log(courses);
        res.status(200).json(courses);
    } catch (e) {
        console.error(e);
    }
 };