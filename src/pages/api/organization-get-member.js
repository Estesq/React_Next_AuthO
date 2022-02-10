const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let result = await fetch(
    `${req.body.aud[0]}users/${req.query.user}/organizations`,
    {
      headers: {
        Authorization: `Bearer ${req.query.token}`
      }
    }
  )
  let result2 = await result.json()

  return res.send({
    status: 'success',
    data: result2
  })
})
