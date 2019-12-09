const cron = require("node-cron");
const fns = require('./fns');
const dlfns = require('./dlfns');
cron.schedule("*/2 * * * *", () => {
  console.log('init');
  fns.init();
});

cron.schedule("*/15 * * * *", () => {
  // console.log("clear");
  // fns.clearDomains();
});  

cron.schedule("*/1 * * * *", () => {
  console.log('getAvailable');
  dlfns.runGetAvailable();
});

