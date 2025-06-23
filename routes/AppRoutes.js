const Router = require("express").Router();

const agencyRouter = require("./agencyRoutes");
const agencyHistoryRouter = require("./AgencyHistoryRoutes");

Router.use("/agency", agencyRouter);
Router.use("/history", agencyHistoryRouter);

module.exports = Router;
