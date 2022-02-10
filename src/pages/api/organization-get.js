const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let result = await fetch(`${req.body.aud[0]}organizations`, {
    headers: {
      Authorization: `Bearer ${req.query.token}`
    }
  })
  let result2 = await result.json()
  const result3 = result2.filter(
    el => el.metadata.created_by === req.query.user
  )
  return res.send({
    status: 'success',
    data: result3
  })
})
