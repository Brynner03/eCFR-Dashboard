const xpath = require("xpath");
const { DOMParser } = require("xmldom");

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

// TEMP TEST
if (require.main === module) {
  (async () => {
    const count = await getWordCount({ title: 5, chapter: "III" });
    console.log("Word count:", count);
  })();
}
