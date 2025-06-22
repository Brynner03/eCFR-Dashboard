const crypto = require("crypto")

function checksumGenerator(agencyData) {

    const baseString = JSON.stringify({
        slug: agencyData.slug,
        cfr_references: agencyData.cfr_references,
    })

    return crypto.createHash("sha256").update(baseString).digest("hex")
}

module.exports = checksumGenerator