/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useState } from 'react'

const MCQ = ({text}) => {
    const [selected, setSelected] = useState(-1);

    // const regex = text.match(/([\w|\s]*[\?|.]*).*@\[(.*)\].*@(\d)/);
    
    const regex = text.match(/([\w|\s]*)\?\s*@\[([\w|\s\/]*)]\s*@(\d)/);
    const question = regex[1];
    const options = regex[2].split("/");
    const correct = parseInt(regex[3])
        
    console.log(options);

   return <div>
    <h4>{question}</h4>
    <div css={css`display:flex;`}>
        {
            options.map((e, i) => <button onClick={() => selected===-1?setSelected(i):{}} 
            css={css`background-color:${selected===correct&&selected===i?"lightgreen":selected!==correct&&selected===i?"#FFCCCB":selected!=-1 &&selected!==correct&&correct===i?"#FFFF8F":"white"}; 
            padding:5px; margin:2px; width:fit-content; border:1px solid lightgray; cursor:pointer; `}>{e}</button>)
        }
    </div>
        {selected===-1?null:selected===correct?<p>Correct!</p>:<p>Wrong! Correct Answer: {options[correct]}</p>}
   </div>
  
}

export default MCQ