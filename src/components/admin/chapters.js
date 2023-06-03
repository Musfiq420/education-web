import axios from 'axios';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LexoRank } from 'lexorank';
import React, { useEffect, useRef, useState } from 'react'
import Lessions from './lessions';

const AddForm = ({mode, value, setValue, onClick, setModalOpen}) => {

  return (
    <div css={css`
        padding: 5%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: start;
        position: absolute; 
        background-color: lightgray;
      `} >
        <div css={css`
          padding: 3%;
          position: absolute; 
          background-color: white;
          opacity: 100%;
        `}
        >
          <div  css={css`
              display: flex;
              justify-content: space-between;
              padding: 5%;
            `}>
              <p>{mode} Chapter</p>
              <button onClick={() => setModalOpen(false)}>X</button>
          </div>
          
          
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={onClick}>Submit</button>
        </div>
      </div>
  )
}

const Chapters = ({course_id, selectedChapterId, setSelectedChapterId, selectedLessionId, setSelectedLessionId}) => {
  const [chapters, setChapters] = useState([]);
  // const [selectedLessionId, setSelectedLessionId] = useState();

  const [chapterInput, setChapterInput] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("Add");

  const dragItem = useRef(null)
	const dragOverItem = useRef(null)

  const handleSort = async () => {
		console.log(dragItem.current+" "+dragOverItem.current);

    let rank;
    if(dragOverItem.current===0)
    {
      rank = LexoRank.parse(chapters[0].rank).genPrev()
    }
    else if(dragOverItem.current===chapters.length)
    {
      rank = LexoRank.parse(chapters[dragOverItem.current-1].rank).genNext();
    }
    else {
      rank = LexoRank.parse(chapters[dragOverItem.current-1].rank).between(LexoRank.parse(chapters[dragOverItem.current].rank));
    }

    const res = await axios.post('/api/updateChapterRank', {
      id:chapters[dragItem.current]._id,
      rank: rank.toString()
    })
    

		dragItem.current = null
		dragOverItem.current = null

    await getChapters(course_id);
	}

  const getChapters = async (course_id) => {

    const res = await axios.get('/api/getChapters', {
      params: {
          course: course_id
      }
    })
    const tempChapters = await res.data;

    setChapters(tempChapters);
  }

  const addChapter = async (course_id, title, index) => {

    let rank;
    if(index===0)
    {
      if(chapters.length===0)
        rank = LexoRank.middle();
      else
        rank = LexoRank.parse(chapters[0].rank).genPrev()
    }
    else if(index===chapters.length)
    {
      rank = LexoRank.parse(chapters[index-1].rank).genNext();
    }
    else {
      rank = LexoRank.parse(chapters[index-1].rank).between(LexoRank.parse(chapters[index].rank));
    }

    const res = await axios.post('/api/addChapter', {
      course_id,
      title,
      rank: rank.toString()
    })

    await getChapters(course_id);
    
  }

  const editChapter = async (id, title) => {
    
    const res = await axios.post('/api/editChapter', {
      id,
      title
    })
    await getChapters(course_id);
  }

  const deleteChapter = async (id) => {
    const res = await axios.post('/api/deleteChapter', {
      id
    })
    await getChapters(course_id);
  }

  useEffect(() => {
    getChapters(course_id);
  },[course_id])
  

  return (
    <div style={{backgroundColor:"lightblue", width:"50%"}}>
      <h3>Chapters</h3>
      {/* <input value={chapterInput} onChange={(e) => setChapterInput(e.target.value)} />  */}
        
        <div style={{padding:"10px"}} />
        
        <button style={{padding:"5px"}} onClick={() =>{setModalMode("Add"); setModalOpen(true)}}>+</button>
        {modalOpen?<AddForm mode={modalMode} value={chapterInput} setValue={setChapterInput} onClick={async() => {modalMode==="Add"? await addChapter(course_id, chapterInput, chapters.length): await editChapter(selectedChapterId, chapterInput); setModalOpen(false);}} setModalOpen={setModalOpen} />
        :null}
        {
          
          chapters.map((e, index) => (
            
            <div
              key={index}
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
            >
              
              
              {/* <button onClick={async() => addChapter(selectedCourseId, chapterInput, index)}>Add</button> */}
              <div style={{display:"flex"}}>
                <button style={{backgroundColor:e._id===selectedChapterId?"white":"lightgray"}} onClick={() => setSelectedChapterId(e._id)}><h3>{index+1}. {e.title}</h3></button>
                {e._id===selectedChapterId?
                <>
                
                  <button style={{padding:"5px"}} onClick={() =>{setModalMode("Edit"); setChapterInput(e.title); setModalOpen(true)}}>edit</button>
                  <button style={{color:"red"}} onClick={async() => deleteChapter(e._id)}>X</button>
                </>:null}
              </div>
              {/* <p>rank: {e.rank}</p> */}
              {e._id===selectedChapterId?<Lessions chapter_id={e._id} selectedLessionId={selectedLessionId} setSelectedLessionId={setSelectedLessionId} />:null}
            </div>
          ))
        }
        
      </div>
  )
}

export default Chapters