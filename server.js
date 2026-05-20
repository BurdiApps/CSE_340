/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts") 
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
// bringing in inventory routes so anything with /inv goes thru here
const inventoryRoute = require("./routes/inventoryRoute")
// base controller handles the home page
const baseController = require("./controllers/baseController")
// utilities has the nav builder, grid builder, and error handler
const utilities = require("./utilities/")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route - this calls the base controller to build and deliver the home page
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes - any route starting with /inv gets sent to the inventory router
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", require("./routes/accountRoute"))

// Review routes
app.use("/review", require("./routes/reviewRoute"))

// File Not Found Route - must be last route in list
// if no other route matches it sends a 404 error to the error handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
// this catches all errors in the app and shows the error view
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  // logging the error to the terminal so i can see what went wrong
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message
  // if its a 404 show the file not found message otherwise show a generic message
  // we dont want to show the actual error to the user for security reasons
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }
  // rendering the error view with the status code and message
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
