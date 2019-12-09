const http = require("http");

const app = require("./app");
const config = require('./config');

const cron = require('./functions/schedule');

app.set("port", config.PORT);

const server = http.createServer(app);
server.on("error", (error) => {
  console.log('An error occured', error)
});
server.on("listening", () => {
  console.log('DLS on http://localhost:' + config.PORT);

});
server.listen(config.PORT);
