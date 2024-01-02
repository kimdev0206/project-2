const express = require("express");
const logger = require("./src/logger");
const routes = require("./src/routes");

const app = express();

app.use(logReqMiddleware, express.urlencoded({ extended: false }));
app.get("/", rootPathHandler);
app.use("/api/users", routes.usersRoute);

function logReqMiddleware(req, _, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function rootPathHandler(_, res) {
  res.redirect(process.env.API_DOCS_URL);
}

module.exports = app;
