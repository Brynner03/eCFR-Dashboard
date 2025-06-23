const Router = require("express").Router();
const controller = require("../controllers/AgencyController");

Router.get("/", controller.getAllAgencies);
Router.get("/:slug", controller.getAgencyHistoryBySlug);

module.exports = Router;
