import Card from "@/components/card";
import MCQ from "@/components/mcq";
import axios from "axios";
import db from "lib/mongodb";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerSession } from "next-auth/next"
import { nextauthOptions } from "@/pages/api/auth/[...nextauth]";

const getPrevInfo = (idx, topics, setIndex) => {
    
  let infoIdx = -1;
  for(let i = idx; i >= 0; i--)
  {
    console.log("i "+i);
    if(topics[i]["type"] === "info")
    {
      infoIdx = i;
      break;

    }
      
  }

  setIndex(infoIdx);
}

function getLessonChapterInfo(courses, chapters, lessons) {
  const result = [];
  for (const lesson of lessons) {
    const chapter = chapters.find((ch) => ch._id.toString() === lesson.chapter);
    const course = courses.find((cr) => cr._id.toString() === chapter.course);

    result.push(
      {params: { course: course._id, lession: lesson._id}}
      );
  }

  return result;
}

export default function Lession({ course_id, topics, sessionObj, progress}) {
  const [index, setIndex] = useState(0);
  const router = useRouter();


  if(!sessionObj)
    return <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <p>Sign In Please</p>
      <br />
      <Link href="/">
      <button style={{padding:"10px"}} >Go to HomePage</button>
      </Link>
    </div>
  
  const setProgress = async (email, course_id, progress) => {
    console.log(email)
    const res = await axios.post('/api/insertProgress', {
          email,
          course_id,
          progress
    })
  }

  return (
    <div style={{paddingTop:"20px", display:'flex', justifyContent:"center", backgroundColor:"white", alignItems:"flex-start", height:"100vh"}}>
      {
        index===topics.length?
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", height:"100%"}}>
          <h4>Lession Finished</h4>
          <br />
          <button style={{padding:"10px", border:"1px solid lightgray", borderRadius:"5px"}} onClick={async() =>{
            if(Number(router.query.index)===Number(progress))
              await setProgress(sessionObj.user.email, course_id, Number(router.query.index)+1); 
              
            router.back();
            }}>Next Lession</button>
        </div>
        :topics[index]?.type==="info"?<Card index={index} setIndex={setIndex} content={topics[index].data.content} />
        :topics[index]?.type==="mcq"? <MCQ index={index} setIndex={setIndex} getPrevInfo={() => getPrevInfo(index, topics, setIndex)} sections={topics[index].data} />
        :null
      }

    </div>
  );
}

// static paths

// export async function getStaticPaths() {
//     const courses = await db.collection("courses").find({}).toArray();
//     let coursesID = [];
//   courses.map((e) => coursesID.push(e._id.toString()));
//   const chapters = await db.collection("chapters").find( { "course": {$in:  coursesID} } ).toArray();
//   let chaptersID = [];
//   chapters.map((e) => chaptersID.push(e._id.toString()));
//   const lessions = await db.collection("lessions").find( { "chapter": {$in:  chaptersID} } ).toArray();

//   const paths = getLessonChapterInfo(courses, chapters, lessions);


//     return {
//       // paths: [{params: {course:"63fffe1f8cd0a177eca5dec0", lession:"642fbe669cbc67b89f960419"}}],
//       paths: JSON.parse(JSON.stringify(paths)) ,
//       fallback: false,
//     };
// }


export async function getServerSideProps(context) { 
    const session = await getServerSession(context.req, context.res, nextauthOptions)
    const topics = await db.collection("cards").find( { "lession": context.params.lession} ).sort({rank:1}).toArray();

    

    let tempProgress = null;
    if(session)
    {
      const res = await db.collection("students").findOne({email:session.user.email});
      tempProgress = res[`${context.params.course}`];
    }

    console.log(topics);
    return {
      props: {
        course_id: context.params.course,
        topics: JSON.parse(JSON.stringify(topics)),
        sessionObj:session,
        progress: tempProgress
      },
    };
  }