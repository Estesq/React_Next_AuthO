import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Auth0 from 'auth0-js'
import auth0 from 'util/auth0'
import { useAuth } from 'util/auth'
const WidgetSSO = (props) => {
  const [user, setuser] = useState()
  const [redirectUrl, setredirectUrl] = useState()
  const toggle = () => {
    setuser(false)
  }
  
  const route = useRouter()
  const auth = useAuth()
  useEffect(() => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const auth0Widget = new Auth0.WebAuth({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      responseType: 'token',
      redirectUri: `${origin}/auth0-callback`,
      connection: 'OpenId-Auth0-IDP',
      scope: 'openid email profile'
    })
    auth0Widget.checkSession({ prompt: 'none' }, (err, authResult) => {
      console.log(err)
      if (!err) {
        auth0.client.userInfo(authResult.accessToken, function (err, user) {
          console.log({ user }, { err }, auth0.user)
          setuser(user)
        })
      }
    })
    
  }, [])

  

  const onSigninWithProvider = provider => {
    auth
      .signinWithProvider(provider)
      .then(user => {
        localStorage.setItem('lastUsedAuthProvider', provider)
        route.push('/dashboard')
        props.onAuth(user)
      })
      .catch(() => {
        //props.onError(error.message)
      })
  }
  return !auth0.user && user ? (
    <>
      <div
        style={{
          width: '350px',
          height: '130px',
          position: 'fixed',
          backgroundColor: '#fff',
          top: '60px',
          right: '10px',
          zIndex: '100',
          boxShadow: '3px 6px 10px -3px rgba(0,0,0,0.77)',
          WebkitBoxShadow: '3px 6px 10px -3px rgba(0,0,0,0.77)',
          MozBoxShadow: '3px 6px 10px -3px rgba(0,0,0,0.77)',
          borderRadius: '5px 5px 5px 5px',
          WebkitBorderRadius: '5px 5px 5px 5px',
          MozBorderRadius: '5px 5px 5px 5px',
          padding: '5px 15px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h6>Continue With Audioone</h6>
          <span onClick={() => toggle()} style={{ cursor: 'pointer' }}>
            &times;
          </span>
        </div>
        <hr />
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <div
            style={{
              minWidth: '30px',
              minHeight: '30px',
              backgroundImage: `url(${user.picture})`,
              backgroundSize: 'cover',
              borderRadius: '50%',
              marginRight: '5px'
            }}
          ></div>
          <div onClick={() => onSigninWithProvider('OpenId-Auth0-IDP')}>
            <h5>{user.name}</h5>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  )
}

export default WidgetSSO
