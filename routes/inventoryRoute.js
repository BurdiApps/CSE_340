// Needed Resources
const express = require("express")
// creating a new router object to handle inventory related routes
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
// when someone goes to /inv/type/1 or /inv/type/2 etc it runs the controller function
// handleErrors wraps it so if something goes wrong the error handler catches it
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory item detail view
// this is for when you click on a specific car to see all its details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process add classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process add inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to trigger intentional error
// this is the route that the footer link uses to create a 500 error on purpose
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Process inventory update
router.post(
  "/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))

// Process inventory delete
router.post("/delete", utilities.handleErrors(invController.deleteItem))

module.exports = router
