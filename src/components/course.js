/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import Link from 'next/link'

const CourseCard = ({title, instructor, about, link}) => {



  return (
    
    <div css={css`
      margin: 10px;
      padding: 10px;
      background-color: #E7F5FF;
      border: 3px solid #339AF0;
      border-radius: 5px;
      width: 150px;
    `
    
    }>
      <Link href={link}>
        <h2 css={css`
          color: #339AF0;
        `}>{title}</h2>
        <p css={css`
          font-style: italic;
          opacity: 0.6;
        `}>
          {instructor}
        </p>
        <div css={css`
          background-color: #FF922B;
          margin-top: 3px;
          margin-bottom: 3px;
          padding-left: 5px;
          padding-right: 5px;
          width: min-content;
          border-radius: 10px;
        `}>
          {/* <p css={css`
            font-size: smaller;
            font-style: italic;
            color: white;
          `}>{category}</p> */}
        </div>
        
        <p css={css`
          color:gray;
        `}>{about}</p>

</Link>
    </div>
  )
}

export default CourseCard