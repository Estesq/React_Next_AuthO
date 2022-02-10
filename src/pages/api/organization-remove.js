import requireAuth from './_require-auth'

export default requireAuth(async (req, res) => {
  let result = await fetch(`${req.body.aud[0]}organizations/${req.query.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${req.query.token}`
    }
  })
  let result2 = await result.json()
  console.log(result2)
  return res.send({
    status: 'success',
    data: result2
  })
})
