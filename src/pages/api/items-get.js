const requireAuth = require("./_require-auth.js");
const { getItemsByOwner, getUser } = require("./_db.js");

export default requireAuth(async (req, res) => {
  const authUser = req.user;
  const { owner } = req.query;

  // Make sure owner is authenticated user
  if (owner !== authUser.uid) {
    return res.send({
      status: "error",
      message: "Cannot get items that belong to a different owner",
    });
  }

  var items = await getItemsByOwner(owner);
  const users = await getUser(authUser.uid)
  if (users.identities) {

    users.identities.map(async (el, index) => {
      await getItemsByOwner(el).then(async (op) => {
        var temp = await op
        temp.map(el2 => {
          items = [...items, el2]
        })
        if (users.identities.length - index == 1) {
          return res.send({
            status: "success",
            data: items,
          });
        }
        return op
      }).catch(err => console.log(err))

      //items.concat(linkedUseritems)

    })
  }
  else {
    return res.send({
      status: "success",
      data: items,
    });
  }
  //console.log("hey",newItems)

});
