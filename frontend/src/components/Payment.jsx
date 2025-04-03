import React from 'react'
import payment from "../assets/payment.jpeg";

const Payment = () => {
  return (
    <div className='pay'>
        <div className='payimg'> 
            <img className='secureimage' src={payment} alt=" payment " />
        </div>
        <div className='payhead'> <h1> Fast and Secure payemnts</h1></div>
        <div className='paypara'>  <p> Increase revenue with seamless bank payment designed to deliver higher conversion rates</p></div>

    </div>
  )
}

export default Payment