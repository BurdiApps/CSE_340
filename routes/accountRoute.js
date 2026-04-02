// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to deliver the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process the registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router
