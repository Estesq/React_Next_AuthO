const requireAuth = require('./_require-auth.js')
export default requireAuth(async (req, res) => {
  const result = await fetch(
    `${req.body.aud[0]}users/${req.body.sub}/identities/${req.body.providerSecondary}/${req.body.idSecondary}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.body.accessToken}`
      }
    }
  )
  let result1 = await result.json()
  res.send({
    status: 'success',
    data: result1
  })
})
