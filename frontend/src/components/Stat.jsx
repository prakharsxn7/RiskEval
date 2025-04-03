import React from 'react'
import stat from"../assets/stat.jpeg";


const Stat = () => {
  return (
    <div className='statmain'>
        <div className='stat_img_cont'> 


            <img className='stat_img' src={stat}  />
        </div>
        <div className='stat_head '> <h1 > Network powered fraud signal</h1></div>
        <div className='stat_para'> <p> Stop identified fraud ,account take over  and risky payment with ML-powered  fraud signal</p></div>

    </div>
  )
}

export default Stat