/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import axios from 'axios';
import { LexoRank } from 'lexorank';
import React, { useEffect, useRef, useState } from 'react'

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

const Lessions = ({chapter_id, selectedLessionId, setSelectedLessionId}) => {
    const [lessions, setLessions] = useState([]);
    const [lessionInput, setLessionInput] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("Add");

    const dragItem = useRef(null)
	  const dragOverItem = useRef(null)

    const handleSort = async () => {
      console.log(dragItem.current+" "+dragOverItem.current);
  
      let rank;
      if(dragOverItem.current===0)
      {
        rank = LexoRank.parse(lessions[0].rank).genPrev()
      }
      else if(dragOverItem.current===lessions.length)
      {
        rank = LexoRank.parse(lessions[dragOverItem.current-1].rank).genNext();
      }
      else {
        rank = LexoRank.parse(lessions[dragOverItem.current-1].rank).between(LexoRank.parse(lessions[dragOverItem.current].rank));
      }
  
      const res = await axios.post('/api/updateLessionRank', {
        id:lessions[dragItem.current]._id,
        rank: rank.toString()
      })
      
  
      dragItem.current = null
      dragOverItem.current = null
  
      await getLessions(chapter_id);
    }
    
    const getLessions = async (chapter_id) => {
        const res = await axios.get('/api/getLessions', {
          params: {
              chapter: chapter_id
          }
        })
        const tempLessions = await res.data;
    
        setLessions(tempLessions);
    }

    const addLession = async (chapter_id, title, index) => {

      let rank;
      if(index===0)
      {
        if(lessions.length===0)
          rank = LexoRank.middle();
        else
          rank = LexoRank.parse(lessions[0].rank).genPrev()
      }
      else if(index===lessions.length)
      {
        rank = LexoRank.parse(lessions[index-1].rank).genNext();
      }
      else {
        rank = LexoRank.parse(lessions[index-1].rank).between(LexoRank.parse(lessions[index].rank));
      }
  
      const res = await axios.post('/api/addLession', {
        chapter_id,
        title,
        rank: rank.toString()
      })
  
      await getLessions(chapter_id);
      
    }

    const editLession = async (id, title) => {
    
      const res = await axios.post('/api/editLession', {
        id,
        title
      })
      await getLessions(chapter_id);
    }

    const deleteLession = async (id) => {
      const res = await axios.post('/api/deleteLession', {
        id
      })
      await getLessions(chapter_id);
    }

    useEffect(() => {
      getLessions(chapter_id)
    },[chapter_id])

    return (
        <div style={{backgroundColor:"lightgreen", width:"80%", marginLeft:"5%", marginTop:"2%", marginBottom:"5%"}}>
          {/* <h3>Lessions</h3> */}
          {/* <input value={lessionInput} onChange={(e) => setLessionInput(e.target.value)} />  */}
        <button style={{padding:"5px"}} onClick={() =>{setModalMode("Add"); setModalOpen(true)}}>+</button>
        {modalOpen?<AddForm mode={modalMode} value={lessionInput} setValue={setLessionInput} onClick={async() => {modalMode==="Add"? await addLession(chapter_id, lessionInput, lessions.length): await editLession(selectedLessionId, lessionInput); setModalOpen(false);}} setModalOpen={setModalOpen} />
        :null}
        <div  />
          {
            lessions.map((e, index) => (
              <div
              key={index}
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
            >
              <button style={{backgroundColor:e._id===selectedLessionId?"white":"lightgray"}} onClick={() => setSelectedLessionId(e._id)}><h3>{index+1}. {e.title}</h3></button>
              {e._id===selectedLessionId?
              <>
              
                <button style={{padding:"5px"}} onClick={() =>{setModalMode("Edit"); setLessionInput(e.title); setModalOpen(true)}}>edit</button>
                <button style={{color:"red"}} onClick={async() => deleteLession(e._id)}>X</button>
              </>
              :null
              }
            </div>
            
            ))
          }
         
        </div>
        
    )
}

export default Lessions