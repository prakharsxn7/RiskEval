import React from 'react'
import Template from './Template'
import assesment from"../assets/assesment.png"

const Login = ({setIsLoggedIn}) => {
  return (
    <Template
      title="Welcome Back"
      desc1="Turn your data in useful insights"
      desc2="use your data for evaluation of credit risk."
      image={assesment}
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Login