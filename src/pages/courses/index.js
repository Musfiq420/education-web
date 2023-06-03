
import CourseCard from '@/components/course';
import db from 'lib/mongodb';
import Link from 'next/link';
import React from 'react';
import courses from '../../data/courses.json'
import { nextauthOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"
import axios from 'axios';
import { useRouter } from 'next/router';

const Course = ({courses, profile}) => {
  const router = useRouter();

  const onClickCourse = async(course_id) => {
    
    if(profile[course_id] === undefined)
    {
      console.log("not set");
      await setProgress(profile.email, course_id, 0);
      router.push("/courses/"+course_id)
    }
    else
    {
      console.log("set");
      router.push("/courses/"+course_id);
    }
      
  }

  const setProgress = async (email, course_id, progress) => {
    console.log(email)
    const res = await axios.post('/api/insertProgress', {
          email,
          course_id,
          progress
    })
  }
  
  return (
    <div>
      <Link href="/">
      <div></div>
      <button style={{padding:"10px", border:"1px solid lightgray", borderRadius:"5px"}} >{`<-`} Go to Home Page</button>
      </Link>
      <br />
      <br />
      <p>{profile.email}</p>
      <h2>Courses</h2>
      <div style={{display:"flex", flexWrap:"wrap"}} >
        {
          courses.map((e) => <div style={{padding:"10px", width:"300px"}} ><button style={{padding:"10px", border:"1px solid lightgray", borderRadius:"5px", width:"100%"}} onClick={() => onClickCourse(e._id)} ><h3>{e.title}</h3><br/>by {e.instructor}</button><br/></div>)
          // courses.map((e) => (<CourseCard title={e.title} instructor={e.instructor} about={e.about} link={`/courses/${e._id}`} /> ))
        }
      </div>
      
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, nextauthOptions)
  const courses = await db.collection("courses").find({}).toArray();
  const profile = await db.collection("students").findOne({email: session.user.email});

  console.log(courses);
  return {
    props: {
      courses: JSON.parse(JSON.stringify(courses)),
      profile: JSON.parse(JSON.stringify(profile))
    },
  };
}

export default Course;