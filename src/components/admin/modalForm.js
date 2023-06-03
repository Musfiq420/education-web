import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const ModalForm = ({title, initialValue, onClick, setOpen}) => {
  const [value, setValue] = useState(initialValue)

  return (
    <div css={css`
        padding: 5%;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: start;
        position: absolute; 
        background-color: lightgray;
        /* opacity: 70%; */
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
              <p>{title}</p>
              <button onClick={() => setOpen(false)}>X</button>
          </div>
          
          
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={onClick}>Submit</button>
        </div>
      </div>
  )
}

export default ModalForm