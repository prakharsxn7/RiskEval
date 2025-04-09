import React from 'react'
import stat from"../assets/stat.jpeg";


const Stat = () => {
  return (
    <div className='statmain'>
        <div className='stat_img_cont'> 


            <img className='stat_img' src={stat}  />
        </div>
        <div className='stat_head '> <h1 > ML - Powered Risk Assessment</h1></div>
        <div className='stat_para'> <p> Identify creditworthy applicants using XGBoost—our efficient, data-backed ML model for accurate credit risk prediction. </p></div>

    </div>
  )
}

export default Stat