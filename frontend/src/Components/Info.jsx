import React from 'react'
import signup from "../assets/signup.jpeg"

const Info = () => {
  return (
    <div className='info'>
        
        <div className='img_containor3'>

            <img  className="img_sig"src={signup} alt=" signup" />
        </div>
        <div className='siHea'> 
            <h1> The Internet fastest finanicial onboarding
            </h1>
            </div>
        <div className='infopra'> <p className='siPara'> increase conversion,flight fraud,and onboard customers to your app or service in second</p></div>



    </div>
  )
}

export default Info