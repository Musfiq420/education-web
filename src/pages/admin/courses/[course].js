import Link from 'next/link';
import Cards from '@/components/admin/cards(obsolete)';
import Chapters from '@/components/admin/chapters';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const Course = () => {
    const router = useRouter();
    console.log(router.query);

  const [selectedChapterId, setSelectedChapterId] = useState();
  const [selectedLessionId, setSelectedLessionId] = useState();


  return (
    <div style={{ height:"100vh"}}>
    <Link href="/admin">
      <button style={{padding:"10px"}} >{`<-`} Go to Admin Page</button>
      </Link>
    <div style={{display:"flex", height:"100%"}}>
        <Chapters course_id={router.query.course} selectedChapterId={selectedChapterId} setSelectedChapterId={setSelectedChapterId} selectedLessionId={selectedLessionId} setSelectedLessionId={setSelectedLessionId} />
        <Cards lession_id={selectedLessionId} />
    </div>
    </div>
    
  )
}

export default Course