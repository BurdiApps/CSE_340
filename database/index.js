// bringing in Pool from pg package so we can connect to the database
const { Pool } = require("pg")
// need dotenv so we can use the .env file variables
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
// checking if were in development mode or production
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl is needed when connecting to the remote db from our local machine
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Added for troubleshooting queries
  // during development - this logs queries to the terminal so we can see them
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  // production mode - no ssl needed because the app and db are on same server
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}
