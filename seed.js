const { db } = require("./db");
const Agency = require("./models/Agency");

const seed = async () => {
  await db.sync({ force: true });
  console.log("Database Synced");

  try {
    const res = await fetch("https://www.ecfr.gov/api/admin/v1/agencies.json");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const agencies = data.agencies;

    // Fetch and create Agencies

    for (const agencyData of agencies) {
      await Agency.create({
        name: agencyData.name,
        shortName: agencyData.short_name,
        displayName: agencyData.display_name,
        sortableName: agencyData.sortable_name,
        slug: agencyData.slug,
        children: agencyData.children,
        cfrReferences: agencyData.cfr_references,
        wordCount: 0,
        regulationCount: 0,
        checksum: null,
        lastUpdated: null,
        latestChange: null,
        hasRecentChange: false,
      });
    }

    console.log("Agency data seeded successfully.");
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
