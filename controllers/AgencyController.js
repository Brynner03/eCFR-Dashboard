const { Agency, AgencyHistory } = require("../models");
const getWordCount = require("../utils/getWordCount");

async function getAllAgencies(req, res) {
  try {
    const agencies = await Agency.findAll();
    res.send(agencies);
  } catch (error) {
    console.error("Failed to fetch agencies: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAgencyHistoryBySlug(req, res) {
  try {
    const { slug } = req.params;
    const agency = await Agency.findOne({
      where: { slug },
      include: [
        {
          model: AgencyHistory,
          as: "history",
          order: [["timestamp", "DESC"]],
        },
      ],
    });

    if (!agency) {
      return res.status(404).json({ error: "Agency not found" });
    }

    res.json(agency);
  } catch (error) {
    console.error("Error fetching agency: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAgencyWordCount(req, res) {
  try {
    const { slug } = req.params;

    const agency = await Agency.findOne({ where: { slug } });
    if (!agency || !agency.cfrReferences?.length) {
      return res
        .status(404)
        .json({ error: "Agency or CFR reference not found" });
    }

    const wordCounts = await Promise.all(
      agency.cfrReferences.map((ref) => getWordCount(ref))
    );
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);

    await agency.update({ wordCount: totalWords });

    res.json({ wordCount: totalWords });
  } catch (err) {
    console.error("Error fetching word count:", err);
    res.status(500).json({ error: "Failed to fetch word count" });
  }
}

module.exports = {
  getAllAgencies,
  getAgencyHistoryBySlug,
  getAgencyWordCount,
};
