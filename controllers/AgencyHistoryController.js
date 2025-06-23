const AgencyHistory = require("../models/AgencyHistory");
const checksumGenerator = require("../utils/checkSumGenerator");

async function getAgencyHistoryBySlug(req, res) {
  const { slug } = req.params;

  try {
    const history = await AgencyHistory.findAll({
      where: { agencySlug: slug },
      order: [["timestamp", "DESC"]],
    });

    res.json(history);
  } catch (error) {
    console.error(`Error fethcing history for ${slug}: `, error);
    res.status(500).json({ error: "Internal Server Error " });
  }
}

async function trackAndUpdateAgencyChanges(agency, updatedData) {
  const inputForChecksum = {
    display_name: updatedData.displayName,
    sortable_name: updatedData.sortableName,
    slug: updatedData.slug,
    children: updatedData.children,
    cfr_references: updatedData.cfrReferences,
  };

  const updatedChecksum = checksumGenerator(inputForChecksum);
  const hasChanged = agency.checkSum !== updatedChecksum;

  if (hasChanged) {
    await AgencyHistory.create({
      agencySlug: agency.slug,
      oldChecksum: agency.checkSum,
      latestChecksum: updatedChecksum,
      changes: "CFR references changed",
    });

    await agency.update({
      name: updatedData.name,
      shortName: updatedData.shortName,
      displayName: updatedData.displayName,
      sortableName: updatedData.sortableName,
      children: updatedData.children,
      cfrReferences: updatedData.cfrReferences,
      checkSum: updatedChecksum,
      lastUpdated: new Date(),
      hasRecentChange: true,
      totalChanges: (agency.totalChanges || 0) + 1,
    });
  }

  return hasChanged;
}

module.exports = {
  trackAndUpdateAgencyChanges,
  getAgencyHistoryBySlug,
};
