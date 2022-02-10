const Auth0 = require('auth0')
const JwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

// Management client for interacting with Auth0 API
const managementClient = new Auth0.ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET
})

// Functions for decoding and verifying access tokens

const jwksClient = JwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})
const jwksClient2 = JwksClient({
  jwksUri: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN_IDP}/.well-known/jwks.json`
})

// Convert functions to promises
const jwtVerify = promisify(jwt.verify)
const getSigningKey = promisify(jwksClient.getSigningKey)
const getSigningKey2 = promisify(jwksClient2.getSigningKey)
function jwtDecode (token) {
  return new Promise((resolve, reject) => {
    const decoded = jwt.decode(token, { complete: true })
    if (decoded) {
      resolve(decoded)
      // console.log({ decoded })
    } else {
      reject(
        err => new Error('Could not decode token' + err + ' ---->' + decoded)
      )
    }
  })
}

function verifyAccessToken (accessToken) {
  return jwtDecode(accessToken).then(async decoded => {
    let resultKey = await getSigningKey(decoded.header.kid)
    // console.log({ resultKey })
    const signingKey = resultKey.getPublicKey()
    return jwtVerify(accessToken, signingKey, {
      algorithms: ['RS256'],
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`
    })
  })
  /*  .then(key => {
      console.log('key\n=========================>\n', { key })
      const signingKey = key.getPublicKey()
      return jwtVerify(accessToken, signingKey, {
        algorithms: ['RS256'],
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`
      })
    }) */
}

module.exports = {
  managementClient,
  verifyAccessToken
}
