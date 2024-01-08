const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("./src/logger");
const routes = require("./src/routes");

const app = express();

app.use(
  logReqMiddleware,
  express.urlencoded({ extended: false }),
  express.json(),
  cookieParser()
);
app.get("/", rootPathHandler);
app.use("/api/users", routes.usersRoute);
app.use("/api/books", routes.booksRoute);
app.use("/api/likes", routes.likesRoute);
app.use("/api/cart-books", routes.cartBooksRoute);

function logReqMiddleware(req, _, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function rootPathHandler(_, res) {
  res.redirect(process.env.API_DOCS_URL);
}

module.exports = app;
