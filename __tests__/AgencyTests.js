const db = require('../db').db;
const Agency = require('../models/Agency');
const AgencyHistory = require('../models/AgencyHistory');
const checksumGenerator = require('../utils/checkSumGenerator');

describe("Agency update tracking", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  it("should track historical changes correctly", async () => {
    // Seed initial agency
    const agencyData = {
        name: "Test Agency Display",
        displayName: "Test Agency Display",
        sortableName: "Test Agency",
        slug: "test-agency",
        children: [],
        cfrReferences: [{ title: 1, chapter: "I" }],
      };
      

    const initialChecksum = checksumGenerator(agencyData);


    // Save original
    const agency = await Agency.create({
      ...agencyData,
      checkSum: initialChecksum
    });
    
    agencyData.cfrReferences.push({ title: 2, chapter: "II" });
    const updatedChecksum = checksumGenerator(agencyData);

    const hasChanged = agency.checkSum !== updatedChecksum;

    // If changed, update agency and log to history
    if (hasChanged) {
        await AgencyHistory.create({
          agencySlug: agency.slug,
          oldChecksum: agency.checkSum,
          latestChecksum: updatedChecksum,
          changes: "CFR references changed",      
        });
      
        agency.checkSum = updatedChecksum;
        agency.lastUpdated = new Date();
        agency.hasRecentChange = true;
        agency.totalChanges = agency.totalChanges + 1;
      
        await agency.save();
      }
      
    const updated = await Agency.findOne({ where: { slug: "test-agency" } });
    const history = await AgencyHistory.findAll({ where: { agencySlug: "test-agency" } });

    expect(updated.hasRecentChange).toBe(true);
    expect(updated.totalChanges).toBe(2);
    expect(history.length).toBe(1);
    expect(history[0].dataValues.oldChecksum).toBe(initialChecksum);
    expect(history[0].dataValues.latestChecksum).toBe(updatedChecksum);
  });

  afterAll(async () => {
    await db.close();
  });
});
