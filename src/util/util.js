import auth0 from './auth0'

export function apiRequest (path, method = 'GET', data) {
  const accessToken = auth0.extended.getAccessToken()
  const uid = auth0.extended.getUid()
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      uid: uid
    },
    body: data ? JSON.stringify(data) : undefined
  })
    .then(response => {
      return response.json()
    })
    .then(response => {
      if (response.status === 'error') {
        //continue without any action if no data found
        if (response.code === 'auth/empty-uid-and-token') {
          if (auth0.extended.getUid().split('|')[2] != 'email')
            auth0.extended.logout()
        }

        // Automatically signout user if accessToken is no longer valid
        if (response.code === 'auth/invalid-user-token') {
          //don't log out if passwordless user
          if (
            auth0.extended.getUid() &&
            auth0.extended.getUid().split('|')[2] != 'email'
          )
            auth0.extended.logout()
        }

        throw new CustomError(response.code, response.message)
      } else {
        return response.data
      }
    })
}

// Create an Error with custom message and code
export function CustomError (code, message) {
  const error = new Error(message)
  error.code = code
  return error
}
