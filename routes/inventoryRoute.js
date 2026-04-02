// Needed Resources
const express = require("express")
// creating a new router object to handle inventory related routes
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
// when someone goes to /inv/type/1 or /inv/type/2 etc it runs the controller function
// handleErrors wraps it so if something goes wrong the error handler catches it
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory item detail view
// this is for when you click on a specific car to see all its details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to trigger intentional error
// this is the route that the footer link uses to create a 500 error on purpose
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router
