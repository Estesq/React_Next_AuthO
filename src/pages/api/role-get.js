const requireAuth = require('./_require-auth.js')
export default requireAuth(async (req, res) => {
  let result = await fetch(
    `${req.body.aud[0]}organizations/${req.body.org_id}/members/${req.body.user_id}/roles`,
    {
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }
  )
  let roles = await result.json()
  return res.send({
    status: 'successs',
    data: roles
  })
})
