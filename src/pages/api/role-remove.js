const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let result = await fetch(
    `${req.body.aud[0]}organizations/${req.body.org_id}/members/${req.body.user_id}/roles`,
    {
      body: JSON.stringify({ roles: [req.body.role_id] }),
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    }
  )

  res.send({
    status: 'success',
    data: result
  })
})
