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

// Add the buggy model
const welcomeModel = require("./models/welcomeModel")


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
// Index route for home page
app.get("/", function(req, res){
  // Use the buggy model function
  let welcomeMsg;
  try {
    welcomeMsg = welcomeModel.getWelcomeMessage();
  } catch (err) {
    welcomeMsg = "Error: " + err.message;
  }
  res.render("index", {title: "Home", welcomeMsg})
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
