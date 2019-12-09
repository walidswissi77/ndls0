module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 1111,
  URL: process.env.BASE_URL || "http://localhost:1111",
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/dls',
  // MONGODB_URI:
    // "mongodb://dlsdb:2r3FOPJRmioqJiDeyyjnqOPMw33VnvS44dicEreVGNgJ6RheE7pfGVifcPhXSGSHaRq2aVHYMYpqhNqkhjrbxQ==@dlsdb.documents.azure.com:10255/?ssl=true",
  JWT_SECRET: process.env.JWT_SECRET || "canyoukeepasecret"
};