const Agency = require("./Agency");
const AgencyHistory = require("./AgencyHistory");

Agency.hasMany(AgencyHistory, {
  foreignKey: "agencySlug",
  sourceKey: "slug",
  as: "history",
});

AgencyHistory.belongsTo(Agency, {
  foreignKey: "agencySlug",
  targetKey: "slug",
});

module.exports = {
  Agency,
  AgencyHistory,
};
