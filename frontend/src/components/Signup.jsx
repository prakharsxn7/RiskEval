import React from 'react'
import Template from './Template'
import assesment from"../assets/assesment.png"

const Signup = ({setIsLoggedIn}) => {
  return (
    <Template
      title="Welcome"
      desc1=""
      desc2=""
      image={assesment}
      formtype="Signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Signup



