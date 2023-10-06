"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri()
  });
}

db.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });

module.exports = db;