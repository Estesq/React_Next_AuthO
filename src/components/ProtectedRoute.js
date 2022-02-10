import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Jumbotron } from 'react-bootstrap'
import { useAuth } from 'util/auth'
import auth0 from 'util/auth0'

const ProtectedRoute = () => {
  const auth = useAuth()
  //redirecting if user logged in
  const route = useRouter()

  return (
    <Jumbotron className='text-center'>
      <h3>Kindly verify your email to enjoy this service.</h3>
      <p>Please Verify your email first!</p>
    </Jumbotron>
  )
}

export default ProtectedRoute
