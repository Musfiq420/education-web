/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import { LexoRank } from 'lexorank';
import { parseMarkdown } from 'lib/parsemd';
import React, { useEffect, useRef, useState } from 'react'

function createMarkup(text) {
  return {__html: parseMarkdown(text)};
}

const AddMCQForm = ({cardMCQ, setCardMCQ, addCard, setEditCardID, setModalOpen}) => {

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
              <p>MCQ</p>
              <button onClick={() => {setModalOpen(false);setCardMCQ({
      "question": "",
      "options": ["", "", ""],
      "correct": 0
    });setEditCardID(null)}}>X</button>
          </div>
          
          
          <div>
            <div>
              <p>Question: </p>
              {/* <input value={cardMCQ.question} onChange={(e) => setCardMCQ({
                ...cardMCQ,
                question: e.target.value                
              })} /> */}
              <textarea rows="3" cols="40" value={cardMCQ.question} onChange={(e) => setCardMCQ({
                ...cardMCQ,
                question: e.target.value                
              })} />
            </div>
            <div>
              <p>Option 1: </p>
              <input value={cardMCQ.options[0]} onChange={(e) => {const temp = cardMCQ.options; temp[0] = e.target.value; setCardMCQ({
                options: temp,
                ...cardMCQ
              })}} />
            </div>
            <div>
              <p>Option 2: </p>
              <input value={cardMCQ.options[1]} onChange={(e) => {const temp = cardMCQ.options; temp[1] = e.target.value; setCardMCQ({
                options: temp,
                ...cardMCQ
              })}} />
            </div>
            <div>
              <p>Option 3: </p>
              <input value={cardMCQ.options[2]} onChange={(e) => {const temp = cardMCQ.options; temp[2] = e.target.value; setCardMCQ({
                options: temp,
                ...cardMCQ
              })}} />
            </div>
            <div>
              <br>
              </br>
              <p>Correct: </p>
              <select value={cardMCQ.correct} onChange={(e) => setCardMCQ({
                ...cardMCQ,
                correct: e.target.value
              })}>
                <option value={0}>{cardMCQ.options[0]}</option>
                <option value={1}>{cardMCQ.options[1]}</option>
                <option value={2}>{cardMCQ.options[2]}</option>
              </select>
            </div>
            <br />
            <button onClick={() => {addCard();setModalOpen(false);setEditCardID(null)}}>ADD MCQ</button>
          </div>
          {/* <button onClick={onClick}>Submit</button> */}
        </div>
      </div>
  )
}

const AddInfoForm = ({cardInfo, setCardInfo, addCard, setEditCardID, setModalOpen}) => {

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
          width: 100%;
          height: 100%;
        `}
        >
          <div  css={css`
              display: flex;
              justify-content: space-between;
              padding: 5%;
            `}>
              <p>Concept</p>
              <button onClick={() => {setModalOpen(false); setCardInfo(""); setEditCardID(null)}}>X</button>
          </div>
          
          
          <div>
            <div>
              
              <div css={css`height:60vh;
              `}>
                <label>Preview</label>
                <div css={css`height: 30vh; overflow-y:scroll;`}>
                  
                  <div css={css`
                  margin: 10px;
                `} dangerouslySetInnerHTML={createMarkup(cardInfo)} />
                </div>
                <div css={css`height: 30vh`}>
                  <p>Markdown</p>
                  <textarea rows="10" cols="40" value={cardInfo} onChange={(e) => setCardInfo(e.target.value)} />
                </div>
                
              </div>

              {/* <input value={cardInfo} onChange={(e) => setCardInfo(e.target.value)} /> */}
            </div>
            <br />
            <button onClick={() => {addCard();setModalOpen(false);setEditCardID(null)}}>ADD INFO</button>
          </div>
          {/* <button onClick={onClick}>Submit</button> */}
        </div>
      </div>
  )
}

const Cards = ({lession_id}) => {
    const [cards, setCards] = useState([]);

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [MCQModalOpen, setMCQModalOpen] = useState(false);
    const [editCardID, setEditCardID] = useState(null);
    const [type, setType] = useState("info");

    const [cardInfo, setCardInfo] = useState("");
    const [cardMCQ, setCardMCQ] = useState({
      "question": "",
      "options": ["", "", ""],
      "correct": 0
    })

    // const [cardQuestion, setCardQuestion] = useState("");
    // const [cardOptions, setCardOptions] = useState(["", "", ""]);
    // const [cardCorrect, setCardCorrect] = useState(0);

    const dragItem = useRef(null)
	  const dragOverItem = useRef(null)

    const handleSort = async () => {
      console.log(dragItem.current+" "+dragOverItem.current);
  
      let rank;
      if(dragOverItem.current===0)
      {
        rank = LexoRank.parse(cards[0].rank).genPrev()
      }
      else if(dragOverItem.current===cards.length)
      {
        rank = LexoRank.parse(cards[dragOverItem.current-1].rank).genNext();
      }
      else {
        rank = LexoRank.parse(cards[dragOverItem.current-1].rank).between(LexoRank.parse(cards[dragOverItem.current].rank));
      }
  
      const res = await axios.post('/api/updateCardRank', {
        id:cards[dragItem.current]._id,
        rank: rank.toString()
      })
      
  
      dragItem.current = null
      dragOverItem.current = null
  
      await getCards(lession_id);
    }
    
    const getCards = async (lession_id) => {
        const res = await axios.get('/api/getCards', {
          params: {
              lession: lession_id
          }
        })
        const tempCards = await res.data;
        console.log(tempCards);
        setCards(tempCards);
    }

    const addCard = async (lession_id, type, data, index) => {

      let rank;
      if(index===0)
      {
        if(cards.length===0)
          rank = LexoRank.middle();
        else
          rank = LexoRank.parse(cards[0].rank).genPrev()
      }
      else if(index===cards.length)
      {
        rank = LexoRank.parse(cards[index-1].rank).genNext();
      }
      else {
        rank = LexoRank.parse(cards[index-1].rank).between(LexoRank.parse(cards[index].rank));
      }
  
      const res = await axios.post('/api/addCard', {
        lession_id,
        type,
        data,
        rank: rank.toString()
      })
      
      setCardInfo("");
      setCardMCQ({
      "question": "",
      "options": ["", "", ""],
      "correct": 0
    })
      await getCards(lession_id);
      
    }

    const editCard = async (id, type, data) => {
      const res = await axios.post('/api/editCard', {
        id,
        type,
        data
      })

      setCardInfo("");
      setCardMCQ({
      "question": "",
      "options": ["", "", ""],
      "correct": 0
    })
      await getCards(lession_id);
    }

    const deleteCard = async (id) => {
      const res = await axios.post('/api/deleteCard', {
        id
      })
      await getCards(lession_id);
    }

    useEffect(() => {
      getCards(lession_id)
    },[lession_id])

    return (
        <div style={{backgroundColor:"lightCyan", width:"50%"}}>
          <h3>Cards</h3>
          <br />
          <div style={{overflowY:"scroll", height:"70%"}}>
          {
            cards.map((e, index) => (
              <div
              style={{padding:"5px"}}
              key={index}
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
            >
              <div style={{backgroundColor:"white", padding:"5px", border:"1px solid lightgray", borderRadius:"5px"}}>
                {e.type==="info"?<div dangerouslySetInnerHTML={createMarkup(e.data.content)} />:
                <div>
                  <p>{e.data.question}</p>
                  <p>1. {e.data.options[0]}</p>
                  <p>2. {e.data.options[1]}</p>
                  <p>3. {e.data.options[2]}</p>
                  <h5>Correct: {e.data.options[e.data.correct]}</h5>
                </div>
                }
              </div>
              {e.type==="info"?<button onClick={() => {setEditCardID(e._id);setInfoModalOpen(true);setCardInfo(e.data.content);}}>Edit</button>
                :<button onClick={() => {setEditCardID(e._id);setMCQModalOpen(true);setCardMCQ({
      "question": e.data.question,
      "options": e.data.options,
      "correct": e.data.correct
    });}}>Edit</button>
            }
              <button style={{color:"red"}} onClick={async() => deleteCard(e._id)}>Delete</button>
              
              
            </div>
            
            ))
          }
          </div>
          
          {
            infoModalOpen?
            <AddInfoForm cardInfo={cardInfo} setCardInfo={setCardInfo} addCard={async() => editCardID?editCard(editCardID, "info", {content:cardInfo}):addCard( lession_id, "info", {content:cardInfo}, cards.length)} setEditCardID={setEditCardID} setModalOpen={setInfoModalOpen}  />
            :MCQModalOpen?
            <AddMCQForm cardMCQ={cardMCQ} setCardMCQ={setCardMCQ} addCard={async() => editCardID?editCard(editCardID, "mcq", {question:cardMCQ.question, options:cardMCQ.options, correct:Number(cardMCQ.correct)}):addCard(lession_id, "mcq", {question:cardMCQ.question, options:cardMCQ.options, correct:Number(cardMCQ.correct)}, cards.length)} setEditCardID={setEditCardID} setModalOpen={setMCQModalOpen} />
            :<div css={css`
            margin: 10px;
            padding: 10px;
            display: flex;
            justify-content: center;
          `}>
            <button onClick={() => setInfoModalOpen(true)}>Add Info</button>
            <button onClick={() => setMCQModalOpen(true)}>Add MCQ</button>
          </div>
          }
        </div>
        
    )
}

export default Cards