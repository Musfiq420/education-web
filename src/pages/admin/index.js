import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    const router = useRouter();

    const onClickCourse = async(course_id) => {
          router.push("/admin/courses/"+course_id)
    }

    const getCourses = async () => {
      const res = await fetch('api/getCourses');
      const data = await res.json();
  
      setCourses(data);
    }
    
    useEffect(() => {
      getCourses();
    }, [])


  return (
    <div>
        <h2>Admin Panel</h2>
      <div style={{display:"flex", flexWrap:"wrap"}} >
        {
          courses.map((e) => <div style={{padding:"10px"}} ><button style={{padding:"10px"}} onClick={() => onClickCourse(e._id)} ><h3>{e.title}</h3><br/>by {e.instructor}</button><br/></div>)
          // courses.map((e) => (<CourseCard title={e.title} instructor={e.instructor} about={e.about} link={`/courses/${e._id}`} /> ))
        }
      </div>
    </div>
  )
}

export default Admin