import requireAuth from './_require-auth'

export default requireAuth(async (req, res) => {
  let result = await fetch(`${req.body.aud[0]}organizations`, {
    body: JSON.stringify(req.body.data),
    headers: {
      Authorization: `Bearer ${req.body.token}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  let result1 = await result.json()
  /*if (!result1.error) {
    await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/organizations/${result1.id}/enabled_connections`,
      {
        body: JSON.stringify({
          connection_id: 'con_hjUjCt6hBOIAZsKf',
          assign_membership_on_login: true
        }),
        headers: {
          Authorization: `Bearer ${req.body.token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
  }*/
  res.send({
    status: 'success',
    data: result1
  })
})
