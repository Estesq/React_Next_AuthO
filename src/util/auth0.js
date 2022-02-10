import { promisify } from 'es6-promisify'
import Auth0 from 'auth0-js'
import { apiRequest, CustomError } from './util.js'
import { getUser } from './db'
import { Auth0Client } from '@auth0/auth0-spa-js'
import { async } from 'analytics/lib/analytics.cjs'

// Initialize Auth0
const auth0Realm = 'Username-Password-Authentication'
const auth0 = new Auth0.WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
  responseType: 'token id_token',
  scope:
    'openid email profile read:users read:current_user read:user_idp_tokens update:users update:current_user_identities'
})
// const auth0_1 = new Auth0.WebAuth({
//   domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
//   clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
//   audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
//   responseType: "token id_token",
//   scope:"openid email profile read:users read:user_idp_tokens update:users update:current_user_identities",
// });
// First let's create promisified versions of the Auth0 methods we need
// so that we can use then().catch() instead of dealing with callback hell.
// We use bind so that internally "this" still has the correct scope.

const signupAndAuthorize = promisify(auth0.signupAndAuthorize.bind(auth0))
const login = promisify(auth0.client.login.bind(auth0.client))
const popupAuthorize = promisify(auth0.popup.authorize.bind(auth0.popup))
const userInfo = promisify(auth0.client.userInfo.bind(auth0.client))
const changePassword = promisify(auth0.changePassword.bind(auth0))
const signupwithpasswordless = promisify(auth0.passwordlessStart.bind(auth0))

// Now lets wrap our methods with extra logic, such as including a "connection" value
// and ensuring human readable errors are thrown for our UI to catch and display.
// We make these custom methods available within an auth0.extended object.

let onChangeCallback = () => null
let isLoggedIn = false
auth0.extended = {
  loggedIn: isLoggedIn,
  getCurrentUser: () => {
    const accessToken = getAccessToken()
    return userInfo(accessToken).catch(handleError)
  },

  signupAndAuthorize: options => {
    return signupAndAuthorize({
      connection: auth0Realm,

      ...options
    })
      .then(handleAuth)
      .catch(handleError)
  },

  signupwithpasswordless: options => {
    return signupwithpasswordless({
      connection: 'email',
      send: 'link',
      ...options
    })
      .then(handlePasswordlessUser)
      .catch(handleError)
  },

  login: options => {
    return login({
      realm: auth0Realm,
      ...options
    })
      .then(handleAuth)
      .catch(handleError)
  },

  popupAuthorize: options => {
    console.info('\n1\n2\n', options, '\n1\n2\n')
    return popupAuthorize({ ...options })
      .then(handleAuth)
      .catch(handleError)
  },

  // Send email so user can reset password
  changePassword: options => {
    return changePassword({
      connection: auth0Realm,
      ...options
    }).catch(error => handleError(error, true))
  },

  updateEmail: email => {
    return apiRequest('auth-user', 'PATCH', { email })
  },

  // Update password of authenticated user
  updatePassword: password => {
    return apiRequest('auth-user', 'PATCH', { password })
  },

  updateProfile: data => {
    return apiRequest('auth-user', 'PATCH', data)
  },

  logout: () => {
    handleLogout()
  },

  parseHashFromUrl: () => {
    auth0.parseHash((err, authResult) => {
      console.log('authresult =====>', authResult)
      if (authResult && authResult.accessToken && authResult.idToken) {
        setAccessToken(authResult.accessToken)
        isLoggedIn = true
        setUid(authResult.idTokenPayload.sub)
      } else if (err) {
        console.error(err)
      }
    })
    return true
  },

  //linking user identifier
  linkAccount: async () => {
    const accessToken = getAccessToken()
    const userDetails = await userInfo(accessToken)
    const { sub } = userDetails
    const a0 = await new Auth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    })
    await a0.loginWithPopup({
      max_age: 0,
      scope: 'openid'
    })
    console.log(a0)
    const { __raw: targetUserIdToken } = await a0.getIdTokenClaims()
    let newval = await apiRequest('account-link', 'POST', {
      sub,
      targetUserIdToken,
      accessToken
    })
    return await newval
  },
  //unlinking user identifier
  unlinkAccount: async (providerSecondary, idSecondary) => {
    const accessToken = getAccessToken()
    const userDetails = await userInfo(accessToken)
    const { sub } = userDetails
    console.log(userDetails)
    let newval = await apiRequest('account-unlink', 'POST', {
      sub,
      providerSecondary,
      idSecondary,
      accessToken
    })
    return await newval
  },
  //enlisting identifiers
  linkedAccountList: async () => {
    console.log('latest', getUser(getUid()))
    const accessToken = getAccessToken()
    //return empty object  if  no accesstoken i.e user has not verified
    if (!accessToken) return null
    const userDetails = await userInfo(accessToken)
    let ressghj = new Auth0.Management({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      token: accessToken
    }).getUser(userDetails.sub, (err, profile) => {
      return profile
    })
    let rfss = await fetch(ressghj.request.url, {
      headers: ressghj.request.header,
      method: ressghj.request.method
    })
    let finalres = [await rfss.json()]
    console.log({ finalres })
    return finalres
  },
  // Create a new organization
  createOrganization: async data => {
    let result = await apiRequest('organization-create', 'POST', {
      data,
      token: getMngmnt()
    })
    console.log(result)
    return result
  },
  //list of organizations
  getOrganizations: async () => {
    const accessToken = getAccessToken()
    const user = await userInfo(accessToken)
    let result = await apiRequest(
      `organization-get?user=${user.sub}&token=${getMngmnt()}`
    )
    return await result
  },
  //membership
  getMembership: async () => {
    const accessToken = getAccessToken()
    const user = await userInfo(accessToken)
    const usersub = await encodeURIComponent(user.sub)
    let result = await apiRequest(
      `organization-get-member?user=${usersub}&token=${getMngmnt()}`
    )
    return await result
  },
  //Remove organization
  removeOrganization: async id => {
    let result = await apiRequest(
      `organization-remove?id=${id}&token=${getMngmnt()}`
    )
    return await result
  },
  // checkSession
  checkSession: () => {
    const redirectUri =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
    return auth0.checkSession(
      {
        redirectUri: redirectUri
      },
      function (err, authResult) {
        if (err) return err
        return authResult
      }
    )
  },
  //Add new memnber to organization
  addMembers: async (email, id, name) => {
    let result = await apiRequest('member-add', 'POST', {
      email,
      id,
      name,
      token: getMngmnt()
    })
    console.log(result)
    return result
  },
  // Remove Member
  removeMember: async (id, memberId) => {
    let result = await apiRequest('member-remove', 'POST', {
      memberId,
      id,
      token: getMngmnt()
    })
    console.log(result)
    return result
  },
  //members list
  memberList: async id => {
    let orgMembers = await apiRequest('member-list', 'POST', {
      id,
      token: getMngmnt()
    })
    return await orgMembers
  },
  roleList: async () => {
    let roles = await apiRequest('role-list', 'POST', {
      token: getMngmnt()
    })
    return await roles
  },
  //Role assign
  assignRole: async (org_id, user_id, role_id) => {
    let assign = await apiRequest('role-assign', 'POST', {
      org_id,
      user_id,
      role_id,
      token: getMngmnt()
    })
    return 'Successful'
  },
  //remove role
  removeRole: async (org_id, user_id, role_id) => {
    let assign = await apiRequest('role-remove', 'POST', {
      org_id,
      user_id,
      role_id,
      token: getMngmnt()
    })
    return 'Successful'
  },
  //get role
  getRole: async (org_id, user_id) => {
    let get = await apiRequest('role-get', 'POST', {
      org_id,
      user_id,
      token: getMngmnt()
    })
    return get
  },
  // A method for listening to to auth changes and receiving user data in passed callback
  onChange: function (cb) {
    // Store passed callback function
    onChangeCallback = cb

    const handleOnChange = (data, key) => {
      if (key === TOKEN_STORAGE_KEY && data) {
        userInfo(data)
          .then(user => {
            onChangeCallback(user)
          })
          .catch(error => handleError(error, true))
      }
      //using uid if no access token
      else if (key === UID_STORAGE_KEY && data) {
        getUser(data)
          .then(user => {
            user.sub = user.uid
            onChangeCallback(user)
          })
          .catch(error => handleError(error, true))
      } else {
        onChangeCallback(false)
      }
    }

    // Local Storage listener
    // This is ONLY called when storage is changed by another tab so we
    // must manually call onChangeCallback after any user triggered changes.
    const listener = window.addEventListener(
      'storage',
      ({ key, newValue }) => {
        if (key === TOKEN_STORAGE_KEY) {
          handleOnChange(newValue, key)
        }
        // if token not present, check for uid for possibility of passwordless user
        else if (key === UID_STORAGE_KEY) {
          handleOnChange(newValue, key)
        }
      },
      false
    )

    // Get accessToken from storage and call handleOnChange.
    const accessToken = getAccessToken()
    if (accessToken == null) {
      const uid = getUid()
      handleOnChange(uid, UID_STORAGE_KEY)
    } else {
      handleOnChange(accessToken, TOKEN_STORAGE_KEY)
    }

    // Return an unsubscribe function so calling function can
    // call unsubscribe when needed (such as when a component unmounts).
    return () => {
      window.removeEventListener('storage', listener)
    }
  },
  getAccessToken: () => {
    if (getAccessToken !== null) {
      isLoggedIn = true
    }
    return getAccessToken()
  },
  getUid: () => getUid(),
  setAccessToken: accessToken => setAccessToken(accessToken),
  setSSO: () => setSSO(),
  getSSO: () => getSSO(),
  removeSSO: () => removeSSO()
}

// Gets passed auth response, stores accessToken, returns user data.
const handleAuth = response => {
  console.log({ response })
  setAccessToken(response.accessToken)
  //management token generation
  managementApi()

  // process.env.NEXT_PUBLIC_AUTH0_MANGEMENT_TOKEN = response.accessToken;
  return userInfo(response.accessToken).then(user => {
    setUid(user.sub)
    if (user.sub.split('|')[0] === 'oidc') {
      setSSO()
    }
    console.log('checking user connection', { user })
    onChangeCallback(user)
    return user
  })
}

const handlePasswordlessUser = response => {
  const user = {
    email: response.email,
    email_verified: response.emailVerified,
    sub: 'email|' + response.Id,
    uid: 'email|' + response.Id
  }
  setUid(user.uid)
  managementApi()
  onChangeCallback(user)
  return user
}

const handleLogout = () => {
  const logoutURL =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '') +
    '/auth/signin'
  if (getSSO()) {
    auth0.logout({
      returnTo: `https://${
        process.env.NEXT_PUBLIC_AUTH0_DOMAIN_IDP
      }/v2/logout?&returnTo=${encodeURI(logoutURL)}&client_id=${
        process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID_IDP
      }`
    })
    removeSSO()
  }

  console.log(logoutURL)

  removeAccessToken()
  removeUid()
  removeMngmntToken()
  onChangeCallback(false)
}

const handleError = (error, autoLogout = false) => {
  console.log('popo up authorize error', error, autoLogout)

  // If error code indicates user is unauthorized then log them out.
  // We only do this if autoLogout is enabled so we can skip in instances
  // where it's not possible its due to token expiration (such as right after login)
  // and we'd rather throw an error that can be displayed by the UI.

  console.log('logout', { error })

  if (error.code === 401 && autoLogout) {
    console.log('autologout', { error })
    handleLogout()
  }

  // Find a human readable error message in an Auth0 error object and throw.
  // Unfortunately, it's not always in the same location :/
  let message
  if (error.code === 'invalid_password') {
    message = `Your password must be: ${error.policy}`
  } else if (typeof error.message === 'string') {
    message = error.message
  } else if (typeof error.description === 'string') {
    message = error.description
  } else if (typeof error.original === 'string') {
    message = error.original
  } else if (error.original && typeof error.original.message === 'string') {
    message = error.original.message
  } else {
    message = error.code // Use error.code if no better option
  }

  throw new CustomError(error.code, message)
}

// Local Storage methods
const TOKEN_STORAGE_KEY = 'auth0_access_token'
const UID_STORAGE_KEY = 'auth0_uid'
const getAccessToken = () => localStorage.getItem(TOKEN_STORAGE_KEY)
const setAccessToken = accessToken =>
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
const getUid = () => localStorage.getItem(UID_STORAGE_KEY)
const setUid = uid => localStorage.setItem(UID_STORAGE_KEY, uid)
const removeAccessToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY)
const removeUid = () => localStorage.removeItem(UID_STORAGE_KEY)
const removeMngmntToken = () => localStorage.removeItem(TOKEN_MNGMNT_KEY)
// management call
const TOKEN_MNGMNT_KEY = 'auth0_mngmnt_token'

const setSSO = () => localStorage.setItem('SSO', 'true')
const getSSO = () => localStorage.getItem('SSO')
const removeSSO = () => localStorage.removeItem('SSO')

const getMngmnt = () => localStorage.getItem(TOKEN_MNGMNT_KEY)
const setMngmnt = accessToken =>
  localStorage.setItem(TOKEN_MNGMNT_KEY, accessToken)
const managementApi = async () => {
  let res1 = await apiRequest('management-token')
  setMngmnt(res1.access_token)
}
export default auth0
