import React from 'react'
import AuthSection from 'components/AuthSection'
import { useRouter } from 'next/router'

function AuthPage (props) {
  const router = useRouter()
  return (
    <AuthSection
      bg='white'
      textColor='dark'
      size='md'
      bgImage=''
      bgImageOpacity={1}
      type={router.query.type}
      providers={['google', 'facebook', 'twitter', 'OpenId-Auth0-IDP']}
      afterAuthPath={router.query.next || '/dashboard'}
    />
  )
}

// Tell Next.js to export static files for each auth page
// See https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
export const getStaticPaths = () => ({
  paths: [
    { params: { type: 'signin' } },
    { params: { type: 'signup' } },
    { params: { type: 'forgotpass' } },
    { params: { type: 'changepass' } },
    { params: { type: 'login' } }
  ],
  fallback: true
})

export function getStaticProps ({ params }) {
  return { props: {} }
}

export default AuthPage
