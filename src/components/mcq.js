/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'

const MCQ = ({sections, index, setIndex, getPrevInfo}) => {

    const [selected, setSelected] = useState(-1);
    const [passed, setPassed] = useState(false);

    useEffect(() => {
      setSelected(-1);
      setPassed(false);
    }, [index])

  return (
    <div css={css`
      /* margin: 10px; */
      display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
      padding: 10%;
      background-color: white;
      /* border: 3px solid rgb(215, 45, 92, 0.3); */
      border-radius: 5px;
      /* width: 70%; */
    `
    
    }>
     <div>   
        <p css={css`
            /* text-align: center; */
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            /* font-size: 24px; */
            font-weight: bold;
            /* color: rgb(78, 42, 42, 1); */
        `}>{sections.question}</p>
          <div css={css`
            display: flex;
            flex-direction:column;
          `}>
          {
              sections.options.map((option, i) => (
              
              <div css={css`
                  margin: 10px 5px 0px 0px;
              `}>
                  <button css={css`
                      background-color: ${selected===sections.correct&&selected===i?"lightgreen":selected!==sections.correct&&selected===i?"#FFCCCB":selected!=-1 &&selected!==sections.correct&&sections.correct===i?"#FFFF8F":"#ededed"};
                      cursor: pointer;
                      padding: 10px;
                      /* width: 70%; */
                      text-align: start;
                      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                      /* font-size: 16px; */
                      border: none;
                      border-radius: 5px;
                      color: rgb(78, 42, 42, 1);
                  `}
                  onClick= {() => {
                    if(selected===-1)
                    {
                      setSelected(i);
                      
                      if(sections.correct === i)
                        setPassed(true)
                    }
                      

                    }}
                  >{option}</button>
              </div>
              ))
          }
          
          </div>
        </div>


      <div css={css`
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
      `}>
      {passed?<button css={css`
                  background-color: #ededed;
                  cursor: pointer;
                  padding: 20px;
                  /* width: 70%; */
                  text-align: start;
                  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  /* font-size: 16px; */
                  border: none;
                  border-radius: 5px;
                  color: rgb(78, 42, 42, 1);
                  margin-bottom: 20%;
              `}
              onClick= {() => setIndex(index+ 1)}
              >Next</button>:
              selected!=-1?
              <button css={css`
                  background-color: #ededed;
                  cursor: pointer;
                  padding: 20px;
                  /* width: 70%; */
                  text-align: start;
                  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  /* font-size: 16px; */
                  border: none;
                  border-radius: 5px;
                  color: rgb(78, 42, 42, 1);
                  margin-bottom: 20%;
              `}
              onClick= {() => getPrevInfo()}
              >Back</button>
              :null
              }
      </div>
    </div>
  )
}

export default MCQ