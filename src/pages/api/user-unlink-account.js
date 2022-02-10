import { getUser, updateUser } from "./_db.js";

const requireAuth = require("./_require-auth.js");

export default requireAuth(async (req, res) => {

    const { primary, secondary } = req.query;
    let first = await getUser(primary)
    if (first.identities) {
        let newidentities = first.identities.filter(ids => ids !== secondary)
        if (newidentities.length > 0) {
            await updateUser(primary, { identities: newidentities })
        }
        else {
            await updateUser(primary, { identities: null })
        }
    }
    else {
        {
            await updateUser(primary, { identities: null })
        }
    }
    res.send({
        status: "success",
    });
});