import { getUser, updateUser } from "./_db.js";

const requireAuth = require("./_require-auth.js");

export default requireAuth(async (req, res) => {

    const { primary, secondary } = req.query;
    let first = await getUser(primary)
    if (first.identities) {
        let newidentities = [secondary, ...first.identities]
        await updateUser(primary, { identities: newidentities })
    }
    else {
        {
            await updateUser(primary, { identities: [secondary] })
        }
    }
    res.send({
        status: "success",
    });
});