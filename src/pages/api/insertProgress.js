import db from "lib/mongodb";

export default async (req, res) => {
    const {email, course_id, progress} = req.body;

    console.log("course-id: "+course_id+" email: "+email+" progress: "+progress);
    try {
        const user = await db.collection("students").updateOne({email:email}, {$set:{[`${course_id}`]:progress}});
        res.status(200).json(user);
    } catch (e) {
        console.error(e);
    }
 };