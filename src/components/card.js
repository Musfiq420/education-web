/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { parseMarkdown } from 'lib/parsemd';
import React, { useState } from 'react'

function createMarkup(text) {
  return {__html: parseMarkdown(text)};
}

const Card = ({content, index, setIndex}) => {
  // const [passed, setPassed] = useState(false)

  return (
    <div css={css`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
      /* margin: 10px; */
      padding: 10%;
      background-color: white;
      /* border: 1px solid gray; */
      /* border-radius: 1px; */
    `
    
    }> 
      <div css={css`
      /* text-align: center; */
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        /* font-size: 24px; */
        color: rgb(78, 42, 42, 1);
      `} dangerouslySetInnerHTML={createMarkup(content)} />
      <div css={css`
        /* margin: 20px; */
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
      `}>
        
      <button css={css`
                  background-color: #ededed;
                  cursor: pointer;
                  padding: 20px;
                  text-align: start;
                  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  /* font-size: 16px; */
                  border: none;
                  border-radius: 5px;
                  color: rgb(78, 42, 42, 1);
                  margin-bottom: 20%;
              `}
              onClick= {() => setIndex(index+ 1)}
              >Next</button>
      </div>
        
    </div>
  )
}

export default Card