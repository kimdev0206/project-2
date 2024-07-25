const serverless = require("serverless-http");
const App = require("./src/App");
const database = require("./src/database");

const app = new App();

app.listen();
database.connect();

module.exports.handler = serverless(app.app);
