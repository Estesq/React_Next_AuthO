import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FormField from 'components/FormField'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth } from 'util/auth.js'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import './SettingsOrganization.scss'
import { Alert, Card, Image, ListGroup } from 'react-bootstrap'
import { Badge } from 'react-bootstrap'
import auth0 from '../util/auth0'
function RoleComponent (props) {
  const auth = useAuth()

  const [role, setRole] = useState()
  const [roles, setRoles] = useState()
  const [error, setError] = useState()
  const [assigned, setAssigned] = useState()
  const [pending, setPending] = useState(false)

  useEffect(async () => {
    let roleList = await auth.roleList()
    await setRoles(roleList)
    let assignedRoles = await auth.getRole(props.org_id, props.user_id)
    await setAssigned(assignedRoles)
  }, [])

  useEffect(async () => {
    let roleList = await auth.roleList()
    await setRoles(roleList)
    let assignedRoles = await auth.getRole(props.org_id, props.user_id)
    await setAssigned(assignedRoles)
  }, [pending])

  const handleSelect = (e, user_id) => {
    // console.log('test999', e.target.value, user_id, props.org_id)
    if (e.target.value === '') {
      setError('Select valid role.')
    } else {
      setRole({
        org_id: props.org_id,
        user_id: props.user_id,
        role_id: e.target.value
      })
      setError(null)
    }
  }
  const handleSave = async () => {
    if (role) {
      setPending(true)
      await auth.assignRole(role.org_id, role.user_id, role.role_id)
      setPending(false)
    } else {
      setError('Select role first...')
    }
  }
  const handleRemove = async role_id => {
    setPending(true)
    await auth.removeRole(props.org_id, props.user_id, role_id)
    setPending(false)
  }
  return (
    <>
      <div>
        <strong>Roles:</strong>{' '}
        {assigned
          ? assigned.map((element, index) => {
              return (
                <Badge
                  variant='warning'
                  style={{ margin: '2px' }}
                  onClick={() => handleRemove(element.id)}
                  key={index}
                >
                  {element.name}&nbsp;&times;
                </Badge>
              )
            })
          : 'Loading...'}
      </div>
      {error ? <Alert variant='danger'>{error}</Alert> : null}
      <Form>
        <Form.Group
          controlId='exampleForm.ControlSelect1'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <Form.Control
            as='select'
            onChange={e => handleSelect(e, props.user_id)}
          >
            <option value=''>Assign Roles</option>
            {roles
              ? roles.map(el => {
                  return (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  )
                })
              : null}
          </Form.Control>
          <Button variant='info' onClick={handleSave}>
            {pending ? 'Saving...' : 'Save'}
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}
function ModalOrganization ({ data, handleModalClose }) {
  const auth = useAuth()
  const [email, setEmail] = useState()
  const [members, setMembers] = useState()
  const [pendingMembers, setPendingMembers] = useState(false)
  const [error, setError] = useState()

  const handleInput = e => {
    setEmail(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setPendingMembers(true)
    await auth.addMembers(email, data.id, data.display_name)

    let mmbrs = await auth.memberList(data.id)
    setPendingMembers(false)
    if (mmbrs.length === members.length) {
      setError('Something Went Wrong, try again!')
    } else {
      handleModalClose()
    }
  }

  const handleRemove = async memberId => {
    setPendingMembers(true)
    await auth.removeMember(data.id, memberId)
    setPendingMembers(false)
  }

  useEffect(async () => {
    let mmbrs = await auth.memberList(data.id)
    await setMembers(mmbrs)
  }, [])

  useEffect(async () => {
    let mmbrs = await auth.memberList(data.id)
    await setMembers(mmbrs)
  }, [pendingMembers])

  return (
    <div className='overlay'>
      <div className='modal1' id='modal1'>
        <div className='content'>
          <h1 className='title'>{data.display_name}</h1>
          {error ? <Alert variant='danger'>{error}</Alert> : null}
          <Form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Form.Group controlId='formName'>
              <FormField
                type='email'
                name='email'
                onChange={handleInput}
                placeholder='Email Of New Member'
                size='lg'
              />
            </Form.Group>
            <Form.Group controlId='formName'>
              <Button onClick={handleSubmit}>
                {pendingMembers ? 'Loading' : 'Submit'}
              </Button>
            </Form.Group>
          </Form>
          <h3>Member List</h3>
          <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            {members
              ? members.map((el, index) => (
                  <>
                    <Card
                      key={index}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      <Card.Header
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <h5 style={{ textAlign: 'left', lineHeight: 1.5 }}>
                          <Image
                            src={el.picture}
                            width='25'
                            height='auto'
                            roundedCircle
                          />
                          {el.name}
                        </h5>
                        <span>
                          <Button
                            variant='primary'
                            onClick={() => handleRemove(el.user_id)}
                          >
                            &times;
                          </Button>
                        </span>
                      </Card.Header>
                      <ListGroup variant='flush'>
                        <ListGroup.Item>
                          <strong>Email: </strong>
                          {el.email}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <RoleComponent
                            user_id={el.user_id}
                            org_id={data.id}
                          />
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </>
                ))
              : null}
          </div>
          {/*<button className='btn close-modal' data-modal="#modal1" href="#" onClick={handleModalClose}></button>*/}
          <Button
            variant='danger'
            style={{ marginRight: 0 }}
            data-modal='#modal1'
            href='#'
            onClick={handleModalClose}
          >
            &times; Close
          </Button>
        </div>
      </div>
    </div>
  )
}
function SettingsOrganization (props) {
  const auth = useAuth()
  const [pending, setPending] = useState(false)
  const [organizations, setOrganizations] = useState()
  const [memberships, setMemberships] = useState()

  //modal

  const [show, setShow] = useState(false)
  const [modalData, setmodalData] = useState()

  const handleClose = () => {
    setShow(false)
  }
  const handleShow = data => {
    setmodalData(data)
    setShow(true)
  }

  const handleData = async () => {
    let getOrg = await auth.getOrganizations()
    await setOrganizations(getOrg)
  }
  const handleRemove = async id => {
    setPending(true)
    console.log(id)
    await auth.removeOrganization(id)
  }

  useEffect(async () => {
    if (auth.user.email_verified && auth0.extended.getAccessToken()) {
      handleData()
      let getMemberships = await auth.getMembership()
      await setMemberships(getMemberships)
    }

    return () => {
      setPending(false)
    }
  }, [])
  useEffect(() => {
    if (auth.user.email_verified && auth0.extended.getAccessToken()) {
      handleData()
    }
    return () => {
      setPending(false)
    }
  }, [pending])

  const { register, handleSubmit, errors, reset, getValues } = useForm()

  const onSubmit = async data => {
    // Show pending indicator
    console.log('test org-2')
    console.log(data)
    const meta = { ...data, metadata: { created_by: auth.user.uid } }
    setPending(true)
    auth
      .createOrganization(meta)
      .then(async res => {
        // Clear form
        console.log('res', res)
        reset()
        // Set success status
        if (res.error) {
          props.onStatus({
            type: 'error',
            message: res.message
          })
        } else {
          props.onStatus({
            type: 'success',
            message: 'Organization added.'
          })
        }
      })
      .catch(error => {
        console.log('error22')
        console.log({ error })
        if (error.code === 'auth/requires-recent-login') {
          // Update state to show re-authentication modal
          props.onStatus({
            type: 'requires-recent-login',
            // Resubmit after reauth flow
            callback: () => onSubmit({ pass: data.pass })
          })
        } else {
          // Set error status
          props.onStatus({
            type: 'error',
            message: error.message
          })
        }
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false)
      })
  }

  return (
    <>
      {show === true ? (
        <ModalOrganization handleModalClose={handleClose} data={modalData} />
      ) : null}
      {(!auth.user.email_verified || !auth0.extended.getAccessToken()) && (
        <h5 style={{ marginTop: '10px' }}>
          Please verify your account to use organization features
        </h5>
      )}

      {auth.user.email_verified && auth0.extended.getAccessToken() && (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId='formName'>
              <FormField
                name='name'
                type='text'
                label='Name'
                placeholder='Name'
                size='lg'
                error={errors.name}
                inputRef={register({
                  required: 'Please enter a name'
                })}
              />
            </Form.Group>
            <Form.Group controlId='formName'>
              <FormField
                name='display_name'
                type='text'
                label='Display Name'
                placeholder='Display Name'
                size='lg'
                error={errors.display_name}
                inputRef={register({
                  required: 'Please enter a display name'
                })}
              />
            </Form.Group>
            <Button type='submit' size='lg' disabled={pending}>
              <span>Save</span>

              {pending && (
                <Spinner
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden={true}
                  className='ml-2 align-baseline'
                >
                  <span className='sr-only'>Sending...</span>
                </Spinner>
              )}
            </Button>
          </Form>
          <h4>Admin:</h4>
          {organizations && !organizations.error
            ? organizations.map((el, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '15px 0',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>{el.display_name}</div>
                  <div>
                    <Button variant='primary' onClick={() => handleShow(el)}>
                      Details
                    </Button>
                    <Button onClick={() => handleRemove(el.id)}>Remove</Button>
                  </div>
                </div>
              ))
            : null
          /* JSON.stringify(organizations) */
          }
          <h4>Membership:</h4>
          {memberships && !memberships.error
            ? memberships.map((el, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '15px 0',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>{el.display_name}</div>
                  <div>{el.name}</div>
                </div>
              ))
            : null
          /* JSON.stringify(organizations) */
          }
        </>
      )}
    </>
  )
}

export default SettingsOrganization
