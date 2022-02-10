const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  console.log('te2', req.body)
  let memberAdd = await fetch(
    `${req.body.aud[0]}organizations/${req.body.id}/members`,
    {
      body: JSON.stringify({ members: [req.body.memberId] }),
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    }
  )
  return res.send({
    status: 'success',
    data: memberAdd
  })
})
