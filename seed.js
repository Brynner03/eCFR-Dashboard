const { db } = require("./db");
const Agency = require("./models/Agency");
const AgencyHistory = require("./models/AgencyHistory");
const checksumGenerator = require("./utils/checkSumGenerator");

const seed = async () => {
  await db.sync({ force: true });
  console.log("Database Synced");

  try {
    const res = await fetch("https://www.ecfr.gov/api/admin/v1/agencies.json");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const agencies = data.agencies;

    for (const agencyData of agencies) {
      const newChecksum = checksumGenerator(agencyData);
      const existing = await Agency.findOne({ where: { slug: agencyData.slug } });

      let hasRecentChange = false;
      let lastUpdated = null;
      let totalChanges = 0;

      if (existing) {
        if (existing.checkSum !== newChecksum) {
          console.log("🔁 Change detected for", agencyData.slug);
          hasRecentChange = true;
          lastUpdated = new Date();
          totalChanges = existing.totalChanges + 1;

          await AgencyHistory.create({
            agencySlug: agencyData.slug,
            previousChecksum: existing.checkSum,
            newChecksum: newChecksum,
            changedAt: lastUpdated,
          });

          await existing.update({
            name: agencyData.name,
            shortName: agencyData.short_name,
            displayName: agencyData.display_name,
            sortableName: agencyData.sortable_name,
            children: agencyData.children,
            cfrReferences: agencyData.cfr_references,
            checkSum: newChecksum,
            hasRecentChange,
            lastUpdated,
            totalChanges,
          });
        } else {
          console.log("✅ No change for", agencyData.slug);
        }
      } else {
        // New record
        await Agency.create({
          name: agencyData.name,
          shortName: agencyData.short_name,
          displayName: agencyData.display_name,
          sortableName: agencyData.sortable_name,
          slug: agencyData.slug,
          children: agencyData.children,
          cfrReferences: agencyData.cfr_references,
          checkSum: newChecksum,
          wordCount: 0,
          regulationCount: 0,
          lastUpdated: new Date(),
          latestChange: null,
          hasRecentChange: false,
          totalChanges: 0,
        });

        console.log("🆕 New agency added:", agencyData.slug);
      }
    }

    console.log("✅ Agency data synced successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await db.close();
    console.log("Database connection closed.");
  }
};

module.exports = {
  seed,
};
