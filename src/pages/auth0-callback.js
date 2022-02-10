import React, { useLayoutEffect, useState } from 'react'
import auth0 from 'util/auth0.js'
import { useAuth } from 'util/auth'
import { Container, Row, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'

function Auth0CallbackPage (props) {
  const auth = useAuth()
  const [pending, setPending] = useState(null)
  const route = useRouter()

  useLayoutEffect(() => {
    // Hide body so layout components are not visible
    // document.body.style.display = 'none'
    // Get auth results and close popup
    auth0.popup.callback()
  }, [])

  const onSigninWithProvider = provider => {
    setPending(provider)
    auth
      .signinWithProvider(provider)
      .then(user => {
        localStorage.setItem('lastUsedAuthProvider', provider)
        route.push('/dashboard')
        props.onAuth(user)
      })
      .catch(error => {
        setPending(null)
        //props.onError(error.message)
      })
  }
  return (
    <>
      <Container>
        <Row
          className='justify-content-center align-items-center'
          style={{ height: '50vh' }}
        >
          {pending === null ? (
            <Button onClick={() => onSigninWithProvider('OpenId-Auth0-IDP')}>
              Click to Continue
            </Button>
          ) : (
            <Button>Loading...</Button>
          )}
        </Row>
      </Container>
    </>
  )
}

export default Auth0CallbackPage
