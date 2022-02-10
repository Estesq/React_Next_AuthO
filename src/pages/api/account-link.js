const requireAuth = require('./_require-auth.js')
export default requireAuth(async (req, res) => {
  let result = await fetch(
    `${req.body.aud[0]}users/${req.body.sub}/identities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.body.accessToken}`
      },
      body: JSON.stringify({
        link_with: req.body.targetUserIdToken
      })
    }
  )
  let result1 = await result.json()
  res.send({
    status: 'success',
    data: result1
  })
})
