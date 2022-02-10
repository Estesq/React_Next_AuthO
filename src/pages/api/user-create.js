const requireAuth = require('./_require-auth.js')
const { createUser, getUser, updateUser } = require('./_db.js')

export default requireAuth(async (req, res) => {
  const authUser = req.user
  const body = req.body
  console.log(body)
  // Make sure authenticated user can only create themself in the database
  console.log('horray---------------', body.uid, authUser.uid)
  if (body.uid !== authUser.uid) {
    return res.send({
      status: 'error',
      message: 'Created user must have the same uid as authenticated user'
    })
  }
  let userdata = await getUser(body.uid)
  if (userdata.id) {
    let count = userdata.count + 1
    await updateUser(userdata.id, { ...userdata, count })
    return res.send({
      status: 'success',
      message: userdata
    })
  } else {
    let result = await createUser(body.uid, { ...body, count: 0 })
    return res.send({
      status: 'success',
      message: result
    })
  }
})
