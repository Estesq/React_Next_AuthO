const { verifyAccessToken } = require('./_auth0.js')
const { getUser } = require('./_db.js')

// Middleware for requiring authentication and getting user
const requireAuth = fn => async (req, res) => {
  // Respond with error if no authorization header
  // console.log(req)
  if (!req.headers.authorization) {
    return res.status(401).send({
      status: 'error',
      message: 'You must be signed in to call this endpoint'
    })
  }

  // Get access token from authorization header ("Bearer: xxxxxxx")
  const accessToken = req.headers.authorization.split(' ')[1]
  const uid = req.headers.uid
  try {
    //Bypass token verification if passwordless login
    if (uid.split('|')[0] == 'email' && !!accessToken) {
      const user = await getUser(uid)

      //user exists in db
      if (Object.keys(user).length != 0) {
        req.user = user
        // Call route function passed into this middleware
        return fn(req, res)
      }
      //user not present in db, create user
      //body has sub only if it is passwordless
      else if (
        req.body.sub &&
        req.body.sub.split('|')[0] == 'email' &&
        !req.body.email_verified
      ) {
        // Set uid value from sub
        req.user = []
        req.user.email = req.body.email
        req.user.email_verified = req.body.email_verified
        req.user.uid = req.body.sub
        req.body = req.user
        // delete req.user.sub;
        // Call route function passed into this middleware
        return fn(req, res)
      } else {
        throw 'NoPasswordlesssUser'
      }
    } else {
      // Get user from token and add to req object
      req.user = await verifyAccessToken(accessToken)
      // Set uid value from sub
      req.user.uid = req.user.sub

      // Call route function passed into this middleware
      return fn(req, res)
    }
  } catch (error) {
    console.log('_require-auth error', error)

    if (error == 'NoPasswordlesssUser') {
      //If no data error, no action, keep expecting data
      // auth/invalid-user-token error (handled by apiRequest in util.js)
      res.status(204).send({
        status: 'warning',
        code: 'auth/empty-uid-and-token',
        message: 'No credentials found'
      })
    } else {
      // If there's an error assume token is expired and return
      // auth/invalid-user-token error (handled by apiRequest in util.js)
      res.status(401).send({
        status: 'error',
        code: 'auth/invalid-user-token',
        message: 'Your login has expired. Please login again.'
      })
    }
  }
}

module.exports = requireAuth
