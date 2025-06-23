const { db, DataTypes } = require("../db");

const AgencyHistory = db.define("AgencyHistory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  agencySlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldChecksum: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  latestChecksum: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  changes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = AgencyHistory;
