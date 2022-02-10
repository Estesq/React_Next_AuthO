const fetch = require('node-fetch')

export default async (req, res) => {
  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

  var urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')
  urlencoded.append('client_id', 'ok2Mh1P6WowQG9Qme8TtmNbI6820mVUf')
  urlencoded.append(
    'client_secret',
    'WwIwR7tsYWIwMECdd0UV_Ler0eSn_1T7FJNbewijPmsrz0IAKd8f0ho9ompHpy2d'
  )
  urlencoded.append(
    'audience',
    `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`
  )

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  let result = await fetch(
    `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
    requestOptions
  )
  let result1 = await result.json()
  return res.send({
    status: 'success',
    data: result1
  })
}
