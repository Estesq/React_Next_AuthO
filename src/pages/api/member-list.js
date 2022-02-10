const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let res2 = await fetch(
    `${req.body.aud[0]}organizations/${req.body.id}/members`,
    {
      headers: {
        Authorization: `Bearer ${req.body.token}`
      }
    }
  )
  let orgMembers = await res2.json()

  res.send({
    status: 'success',
    data: orgMembers
  })
})
