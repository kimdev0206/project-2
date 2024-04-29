const serverless = require("serverless-http");
const App = require("./app");
const database = require("./src/database");

const app = new App();

app.listen();
database.connect();

module.exports.handler = serverless(app.app);
