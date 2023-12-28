const express = require("express");
const debug = require("debug");
const logger = require("./src/logger");
const routes = require("./src/routes");

logger.init(debug);

const app = express();

app.use(logReqMiddleware);
app.get("/", rootPathHandler);
app.use("/api/users", routes.usersRoute);

function logReqMiddleware(req, _, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function rootPathHandler(_, res, _) {
  res.redirect(process.env.API_DOCS_URL);
}

module.exports = app;
