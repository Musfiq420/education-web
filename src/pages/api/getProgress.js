import db from "lib/mongodb";

export default async (req, res) => {
    const {email, course_id} = req.query;
    // console.log("email: "+email+" coure_id: "+course_id);
    try {
        const progress = await db.collection("students").findOne({email:email});
        console.log(JSON.stringify(progress) );
        res.status(200).json(progress[`${course_id}`]);
    } catch (e) {
        console.error(e);
    }
 };