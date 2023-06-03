import React from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import FillIntheBlanksDndKit from './FillIntheBlanksDndKit'
import Card from '../card'

const Cards = () => {


    const content = "Once upon a time there @lived a man called Damocles. A friend of his eventually @became the ruler of a small city. Damocles thought, How lucky my friend is. He is now a ruler. He @must_be_having a great time. He @must_have fine clothes, lots of money and a number of servants. I wish I @had his luck. He @decided to visit his friend to enjoy his hospitality. When he @reached the palace, the king himself @received him with respect and affection. Damocles then told the king that he @was indeed a lucky man. The king @smiled. He @invited his friend to have dinner with him"

  return (
    <div css={css`
        background-color: papayawhip;
        width: 50%;
    `}>
        <h3>Cards</h3>
        <FillIntheBlanksDndKit text={content} />
        {/* {
            contents.map(e => (<Card content={e} />))
        } */}
        <div css={css`
            padding: 10px;
            display: flex;
            justify-content: center;
        `}>
            <button css={css`
                padding: 10px;
            `}>Add</button>
        </div>
        
    </div>
  )
}

export default Cards