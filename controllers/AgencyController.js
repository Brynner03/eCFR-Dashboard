const xpath = require("xpath");
const { DOMParser } = require("xmldom");
const { Agency, AgencyHistory } = require("../models");

async function getWordCount({ title, chapter }) {
  try {
    const date = "2025-05-05";
    const url = `https://www.ecfr.gov/api/versioner/v1/full/${date}/title-${title}.xml`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch Title ${title}: ${res.status}`);
      return 0;
    }

    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, "text/xml");

    // Find the specific <DIV3 TYPE="CHAPTER" N="{chapter}">
    const nodes = xpath.select(
      `//DIV3[@TYPE='CHAPTER' and @N='${chapter}']`,
      doc
    );

    if (!nodes || nodes.length === 0) {
      console.warn(`⚠️ Chapter ${chapter} not found in Title ${title}`);
      return 0;
    }

    const chapterNode = nodes[0];
    const textContent = chapterNode.textContent || "";

    const words = textContent.trim().split(/\s+/);
    return words.length;
  } catch (err) {
    console.error(
      `Error in getWordCount for Title ${title} Chapter ${chapter}:`,
      err
    );
    return 0;
  }
}

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

module.exports = {
  getAllAgencies,
  getWordCount,
  getAgencyHistoryBySlug,
};
