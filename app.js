const express = require("express");
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");
const logger = require("./src/logger");
const routes = require("./src/routes");

const app = express();

app.use(
  logReqMiddleware,
  cors({
    origin: process.env.GUEST,
    exposedHeaders: ["Authorization", "Refresh-Token"],
    credentials: true,
  }),
  express.urlencoded({ extended: false }),
  express.json()
);
app.get("/", rootPathHandler);
app.use("/api/users", routes.usersRoute);
app.use("/api/books", routes.booksRoute);
app.use("/api/likes", routes.likesRoute);
app.use("/api/cart-books", routes.cartBooksRoute);
app.use("/api/orders", routes.ordersRoute);
app.use(errHandler);

function logReqMiddleware(req, _, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function rootPathHandler(_, res) {
  res.redirect(process.env.API_DOCS_URL);
}

function errHandler(err, req, res, _) {
  logger.err(`(Where) ${res.locals.name} method`);
  logger.err(
    `(Who) userID ${req.decodedToken ? req.decodedToken.userID : undefined}`
  );
  logger.err(`(When) ${new Date().toLocaleTimeString()}`);
  logger.err(`(Why) ${err.message}`);

  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message || "서버 내부에서 에러가 발생하였습니다.",
  });
}

module.exports = app;
