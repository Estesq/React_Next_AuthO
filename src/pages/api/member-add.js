const requireAuth = require('./_require-auth.js')

export default requireAuth(async (req, res) => {
  let encodeEmail = encodeURIComponent(req.body.email)
  var members = await fetch(
    `${req.body.aud[0]}users-by-email?fields=user_id&include_fields=true&email=${encodeEmail}`,
    {
      headers: {
        Authorization: `Bearer ${req.body.token}`
      }
    }
  )
  let memberdata = await members.json()
  var memberId
  if (memberdata.length > 0) {
    memberId = memberdata[0].user_id
  } else {
    members = await fetch(`${req.body.aud[0]}users`, {
      body: JSON.stringify({
        email: req.body.email,
        connection: 'email',
        email_verified: true,
        verify_email: false,
        app_metadata: {
          welcome_email_sent: true,
          organization: req.body.name
        }
      }),
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    memberdata = await members.json()
    memberId = memberdata.user_id
  }
  //console.log("te2", memberdata.user_id)
  let memberAdd = await fetch(
    `${req.body.aud[0]}organizations/${req.body.id}/members`,
    {
      body: JSON.stringify({ members: [memberId] }),
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }
  )
  const finalResult = await memberAdd
  console.log(finalResult)
  return res.send({
    status: 'success',
    data: finalResult
  })
})
