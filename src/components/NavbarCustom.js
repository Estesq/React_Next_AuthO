import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Dropdown from 'react-bootstrap/Dropdown'
import auth0 from '../util/auth0'
import { useAuth } from 'util/auth.js'
import { Button } from 'react-bootstrap'

function NavbarCustom (props) {
  const [pending, setpending] = useState(0)
  const auth = useAuth()
  const sendLink = email => {
    setpending(1)
    return auth.signupwithpasswordless(email).then(res => {
      if (res) {
        console.log({ res })
        setpending(2)
      } else {
        setpending(0)
      }
    })
  }
  return (
    <Navbar bg={props.bg} variant={props.variant} expand={props.expand}>
      <Container>
        <Link href='/' passHref={true}>
          <Navbar.Brand>
            <img
              className='d-inline-block align-top'
              src={props.logo}
              alt='Logo'
              height='30'
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls='navbar-nav' className='border-0' />
        <Navbar.Collapse id='navbar-nav' className='justify-content-end'>
          <Nav>
            {auth.user && (
              <NavDropdown id='dropdown' title='Account' alignRight={true}>
                <Link href='/dashboard' passHref={true}>
                  <NavDropdown.Item active={false}>Dashboard</NavDropdown.Item>
                </Link>

                <Link href='/settings/general' passHref={true}>
                  <NavDropdown.Item active={false}>Settings</NavDropdown.Item>
                </Link>

                <Dropdown.Divider />

                <Link href='/auth/signout' passHref={true}>
                  <NavDropdown.Item
                    active={false}
                    onClick={e => {
                      e.preventDefault()
                      auth.signout()
                    }}
                  >
                    Sign out
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            )}

            {!auth.user && (
              <>
                <Nav.Item>
                  <Link href='/auth/signin' passHref={true}>
                    <Nav.Link active={false}>Sign Up</Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href='/auth/login' passHref={true}>
                    <Nav.Link active={false}>Login</Nav.Link>
                  </Link>
                </Nav.Item>
              </>
            )}
            {auth.user && !auth0.extended.getAccessToken() && (
              <Nav.Item>
                <Button onClick={() => sendLink(auth.user.email)}>
                  {pending === 1 ? 'Sending Email...' : null}
                  {pending === 0 ? 'Get Link' : null}
                  {pending === 2 ? 'Email Sent' : null}
                </Button>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarCustom
