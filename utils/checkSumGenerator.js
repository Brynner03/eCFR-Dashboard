const crypto = require("crypto")

function checksumGenerator(agencyData) {

    const baseString = JSON.stringify({
        display_name: agencyData.display_name,
        sortable_name: agencyData.sortable_name,
        slug: agencyData.slug,
        children: agencyData.children,
        cfr_references: agencyData.cfrReferences,
    })

    return crypto.createHash("sha256").update(baseString).digest("hex")
}

module.exports = checksumGenerator