import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './auth'
import auth0 from './auth0'
import ProtectedRoute from 'components/ProtectedRoute'

export const ProtectRoute = ({ children }) => {
  const [protect, setProtect] = useState(false)
  const route = useRouter()
  const { user } = useAuth()

  const [tokenCheck, setTokenCheck] = useState(1)
  const [token, setToken] = useState(false)

  useEffect(() => {
    console.log({ user, t: auth0.extended.getAccessToken() })
    if (user) {
      if (user.count && auth0.extended.getAccessToken() === null) {
        setProtect(true)
      } else {
        setProtect(false)
      }
    }
  }, [])
  useEffect(() => {
    if (window.location.hash && tokenCheck !== 0) {
      setTokenCheck(tokenCheck + 1)
    }
    if (auth0.extended.getAccessToken()) {
      setToken(auth0.extended.getAccessToken())
      setTokenCheck(0)
    }
  }, [tokenCheck])

  useEffect(() => {
    console.log('protectroute', user)
    if (user) {
      if (user.count && auth0.extended.getAccessToken() === null) {
        setProtect(true)
      } else {
        setProtect(false)
      }
    }
    if (!user) {
      setProtect(false)
    }
    return () => {}
  }, [user])

  useEffect(() => {
    if (user) {
      if (user.count && auth0.extended.getAccessToken() === null) {
        setProtect(true)
      } else {
        setProtect(false)
      }
    }
    return () => {}
  }, [token])
  if (protect) {
    return <ProtectedRoute />
  } else {
    return children
  }
}
