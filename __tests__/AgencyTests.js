const db = require("../db").db;
const Agency = require("../models/Agency");
const AgencyHistory = require("../models/AgencyHistory");
const checksumGenerator = require("../utils/checkSumGenerator");
const {
  trackAndUpdateAgencyChanges,
} = require("../controllers/AgencyHistoryController");

describe("Agency update tracking", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  it("should track historical changes correctly", async () => {
    const agencyData = {
      name: "Test Agency Display",
      displayName: "Test Agency Display",
      sortableName: "Test Agency",
      slug: "test-agency",
      children: [],
      cfrReferences: [{ title: 1, chapter: "I" }],
    };

    const initialChecksum = checksumGenerator(agencyData);

    const agency = await Agency.create({
      ...agencyData,
      checkSum: initialChecksum,
      totalChanges: 0,
    });

    // Simulate a change
    agencyData.cfrReferences.push({ title: 2, chapter: "II" });

    const updated = await Agency.findOne({ where: { slug: "test-agency" } });
    const hasChanged = await trackAndUpdateAgencyChanges(updated, agencyData);

    const refreshed = await Agency.findOne({ where: { slug: "test-agency" } });

    const history = await AgencyHistory.findAll({
      where: { agencySlug: "test-agency" },
    });

    expect(hasChanged).toBe(true);
    expect(refreshed.hasRecentChange).toBe(true);
    expect(refreshed.totalChanges).toBe(1);
    expect(history.length).toBe(1);
    expect(history[0].oldChecksum).toBe(initialChecksum);
    expect(history[0].latestChecksum).toBe(refreshed.checkSum);
  });

  afterAll(async () => {
    await db.close();
  });
});
