const express = require("express");
const cors = require("cors");
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

function logReqMiddleware(req, _, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function rootPathHandler(_, res) {
  res.redirect(process.env.API_DOCS_URL);
}

module.exports = app;
