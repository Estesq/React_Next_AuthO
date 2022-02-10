const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let result = await fetch(`${req.body.aud[0]}roles`, {
    headers: {
      Authorization: `Bearer ${req.body.token}`
    }
  })
  let roles = await result.json()
  console.log('Role List', roles)
  return await res.send({
    status: 'success',
    data: roles
  })
})
