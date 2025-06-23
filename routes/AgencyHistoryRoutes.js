const Router = require("express").Router();
const controller = require("../controllers/AgencyHistoryController");

Router.get("/:slug", controller.getAgencyHistoryBySlug);

module.exports = Router;
