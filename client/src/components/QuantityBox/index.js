import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import Button from "@mui/material/Button";
import { useState , useEffect } from "react";

const QunatityBox=(props)=>{

    const [inputVal , setinputVal]=useState(1);
    useEffect(()=>{
        if(props?.value!==undefined && props?.value!==null && props?.value!=="") {
            setinputVal(parseInt(props?.value))
        }
    },[props?.value])
    const minus=()=>{
        if(inputVal!==1 && inputVal>0){
            setinputVal(inputVal-1);
        }
    }

    const plus=()=>{
        setinputVal(inputVal+1);
    }

    useEffect(()=>{
        props.quantity(inputVal);
        props.selectedItem(props.item , inputVal)
    },[inputVal]);

    return (
       <div className='quantityDrop d-flex align-items-center'>
        <Button onClick={minus}><FiMinus /></Button>
        <input type='text' value={inputVal}/>
        <Button onClick={plus}><FiPlus /></Button>
        </div>
    )
}

export default QunatityBox;