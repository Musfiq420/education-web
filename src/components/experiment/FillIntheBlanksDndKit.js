import React, { useEffect, useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {DndContext, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors} from '@dnd-kit/core';


const Paragraph = ({ lines, checked, blanks, onSetBlanks, i}) => {
  
  const {isOver, setNodeRef} = useDroppable({
    id: i.toString(),
  });
  const style = {
    backgroundColor: isOver ? 'green' : undefined,
  };


  return <div  css={css`display:inline;`}>{lines[i]}&nbsp;<input ref={setNodeRef} css={css`
            
            background-color: ${isOver?"green":checked?"white":blanks[i].value===blanks[i].correct?"#EFFFE8":"white"};
            border: ${checked?"2px solid lightGray":blanks[i].value===blanks[i].correct?"2px solid green":"2px solid lightGray"};
            border-radius: 5px;
            outline-color: gray;
            /* width:  ${checked?blanks[i].correct.length+3:blanks[i].value.length+3}ch; */
            width:  ${blanks[i].correct.length+3}ch;
            padding-left: 5px;
            padding-right: 5px;
            color: ${checked?"blue":blanks[i].value===blanks[i].correct?"green":"red"};
            
            &:focus{
              color: ${blanks[i].value===blanks[i].correct?"green":"black"};
            }

          `} 
            value={checked?blanks[i].correct:blanks[i].value} 
            onChange={(e) => onSetBlanks(e.target.value, i)} 
            />&nbsp;</div>
}

const OptionCard = ({text}) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: text,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (<div 
    ref={setNodeRef}
    style={style}
    {...listeners} {...attributes}
  css={css`
    border: 1px solid lightgray;
    margin: 3px;
    border-radius: 5px;
    padding: 3px;
    background-color: ${"white"};
  `} 
  ><p>{text}</p></div>)


}


function shuffleArray(array) {
  const tempArray = array.slice();
  for (var i = tempArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tempArray[i];
      tempArray[i] = tempArray[j];
      tempArray[j] = temp;
  }

  return tempArray;
}


const FillIntheBlanksDndKit = ({text}) => {
  const [checked, setChecked] = useState(false);
  const lines = text.split(/@\w+/g);
  const answers = text.match(/@\w+/g).map((e) => e.slice(1));
  const [blanks, setBlanks] = useState(
    answers.map(e => ({
      value: "",
      correct: e
    }))
  );
  const [options, setOptions] = useState([])

  useEffect(() => {
    setOptions(shuffleArray(answers))
  }, [])

  const onSetBlanks = (value, index) => {
    const tempBlanks = [...blanks];
    tempBlanks[index].value = value;
    setBlanks(tempBlanks);
  }

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

  

  return (
    <DndContext sensors={sensors} onDragEnd={(e) => onSetBlanks(e.active.id, e.over.id)}>
      <div 
      css={css`
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
      `}
      >
        {
          options.map((e) => <OptionCard text={e} />)
        }
      </div>
      <div 
        
        css={css`
          padding: 10px;
        `}>
          <p>
          {
            answers.map((e, i) => (<Paragraph i={i} lines={lines} checked={checked} blanks={blanks} onSetBlanks={onSetBlanks} />
))
          }
          {lines[lines.length-1]}
          </p>
        </div>
      <div css={css`
          margin: 10px;
        `}>
          <button onClick={() => setChecked(!checked)} >{checked?"Reset":"Check"}</button>
        </div>
    
        </DndContext>

  )
}

export default FillIntheBlanksDndKit