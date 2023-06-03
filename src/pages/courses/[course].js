import db from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSession } from "next-auth/next"
import { nextauthOptions } from '../api/auth/[...nextauth]';

const checkIndex = (item, array, ind) => {
  
  if (!Array.isArray(array)) {
    return false; // Return -1 to indicate the item was not found
  }
  
  if(array.indexOf(item)<=ind)
    return true;
  else
    return false;
}

export default function Course({ data }) {
  const router = useRouter();
  const [lessionList, setLessionList] = useState([]);

  if(!data.session)
    return <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <p>Sign In Please</p>
      <br />
      <Link href="/">
      <button style={{padding:"10px", border:"1px solid lightgray", borderRadius:"5px"}} >Go to HomePage</button>
      </Link>
    </div>


  useEffect(() => {
    const tempLessionList = [];
    data.chapters.map((chap) => {
      data.lessions[chap._id].map((lession) => {
        tempLessionList.push(lession._id);
      })
    })
    setLessionList(tempLessionList);
    
    // getProgress(data.session.user.email, data.courseInfo._id);

  }, [])


  return (
    <>
     <Link href="/courses">
      <div></div>
      <button style={{padding:"10px", border:"1px solid lightgray", borderRadius:"5px"}} >{`<-`} Go to Courses</button>
      </Link>
      <br />
      <br />
   <div style={{display:'flex', justifyContent:"center", backgroundColor:"white", alignItems:"flex-start"}}>
    <div style={{ borderRight:"1px solid cyan"}}>
    <h2>{data.courseInfo.title}</h2>
   <p>By {data.courseInfo.instructor}</p>
   
   

   {/* <p>Email: {data.session.user.email}</p> */}
   <br/>
    {
      data.chapters.map((e) => {
      //  console.log(data.lessions[e._id])
      return (<div>
          <h3 style={{padding:"10px"}}>{e.title}</h3>
          <ol>
          {
            // data.lessions[e._id].map((e, i) => <li style={{border:e._id==lessionList[unlock]?"1px solid gray":"none",  color:checkIndex(e._id, lessionList, unlock)?e._id===router.query.lession?"blue":"black":"gray"}}>{checkIndex(e._id, lessionList, unlock)?<Link  href={`${data.courseInfo._id}?lession=${e._id}`}>{i+1}  {e.title}</Link>:<p>{i+1}  {e.title}</p>}</li>)
            data.lessions[e._id].map((e, i) => <li style={{padding:"5px",border:e._id==lessionList[data.progress]?"1px solid gray":"none",  color:checkIndex(e._id, lessionList, data.progress)?e._id===router.query.lession?"blue":"black":"gray"}}>{checkIndex(e._id, lessionList, data.progress)?<Link  href={`${data.courseInfo._id}/${e._id}?index=${lessionList.indexOf(e._id)}&unlock=${data.progress}`}> {e.title}</Link>:<p>{i+1}  {e.title}</p>}</li>)

          }
          </ol>
          
        </div>)
      })
    }
    </div>
   </div>
   
   </>
  );
}

// static paths

// export async function getStaticPaths() {
//   const courses = await db.collection("courses").find({}).toArray();
//     let paths = [];
//     courses.map((e) => {
//      paths.push({params: {course: e._id.toString()}}) 
//     });
    
//     return {
//       paths,
//       fallback: false,
//     };
// }


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, nextauthOptions)

  // const courses = await db.collection("courses").find({id:params.course}).toArray();
  const courseOne = await db.collection("courses").findOne({_id: new ObjectId(context.params.course)});
  const chapters = await db.collection("chapters").find({course: context.params.course}).sort({rank:1}).toArray();
  const chapterID = [];
  const lessions = {};

  chapters.map((element) => {
    chapterID.push(element._id.toString());
  });

  await Promise.all(chapterID.map(id => {
    return db.collection("lessions").find({chapter: id}).sort({rank:1}).toArray()
    .then((res) => {
      lessions[id] = res;      
    })
  }))

  let tempProgress = null;
  if(session)
  {
    const res = await db.collection("students").findOne({email:session.user.email});
    tempProgress = res[`${context.params.course}`];
  }

  

  

  // console.log("lessions :"+JSON.stringify(lessonList) + "chapters :"+JSON.stringify(chapters));
  
    return {
      props: {
        data: JSON.parse(JSON.stringify({courseInfo:courseOne, chapters, lessions, session, progress:tempProgress})),
      },
    };
  }