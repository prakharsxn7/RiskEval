import React from 'react'
import stat from"../assets/stat.jpeg";


const Stat = () => {
  return (
    <div className='statmain'>
        <div className='stat_img_cont'> 


            <img className='stat_img' src={stat}  />
        </div>
        <div className='stat_head '> <h1 > ML- powered Risk assesment</h1></div>
        <div className='stat_para'> <p> Identifiy ethical customer ,using ML-powered  XGBoost </p></div>

    </div>
  )
}

export default Stat