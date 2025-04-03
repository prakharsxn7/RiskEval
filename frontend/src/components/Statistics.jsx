import React from 'react'
import statics from "../assets/statics.jpeg";

const Statistics = () => {
  return (
    <div className='statics_main'>
        <div className='statics_img_cont'>
            <img  className=" statics_img"src={statics} />
        </div>
        <div className='statics_head'> <h1> Software for Financial-institutions</h1></div>
        <div className='statics_para'> <p> Approve more qualified borrowers while minimizing risk using real time financial insights</p></div>

    </div>
  )
}

export default Statistics