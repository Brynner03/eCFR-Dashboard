const { db, DataTypes } = require("../db");

const Agency = db.define("Agency", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sortableName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  children: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  cfrReferences: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  checkSum: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hasRecentChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  totalChanges: {
  type: DataTypes.INTEGER,
  defaultValue: 1,
},
});

module.exports = Agency;
