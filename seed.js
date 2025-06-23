const { db } = require("./db");
const Agency = require("./models/Agency");
const checksumGenerator = require("./utils/checkSumGenerator");
const {
  trackAndUpdateAgencyChanges,
} = require("./controllers/AgencyHistoryController");

const seed = async () => {
  await db.sync({ force: true });
  console.log("Database Synced");

  try {
    const res = await fetch("https://www.ecfr.gov/api/admin/v1/agencies.json");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const agencies = data.agencies;

    for (const agencyData of agencies) {
      const formatted = {
        name: agencyData.name,
        shortName: agencyData.short_name,
        displayName: agencyData.display_name,
        sortableName: agencyData.sortable_name,
        slug: agencyData.slug,
        children: agencyData.children,
        cfrReferences: agencyData.cfr_references,
      };

      const existing = await Agency.findOne({
        where: { slug: formatted.slug },
      });

      if (existing) {
        const changed = await trackAndUpdateAgencyChanges(existing, formatted);

        console.log(
          changed
            ? `Change detected and tracked for ${formatted.slug}`
            : `No change for ${formatted.slug}`
        );
      } else {
        await Agency.create({
          ...formatted,
          checkSum: checksumGenerator(formatted),
          wordCount: 0,
          regulationCount: 0,
          lastUpdated: new Date(),
          latestChange: null,
          hasRecentChange: false,
          totalChanges: 0,
        });

        console.log("New agency added:", formatted.slug);
      }
    }

    console.log("Agency data synced successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    console.log("Database connection closed.");
  }
};

module.exports = {
  seed,
};
