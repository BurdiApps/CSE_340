// bringing in the model and utilities so we can get data and build html
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

// empty object to hold all the inventory controller functions
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
// this handles when someone clicks a nav link like "Sport" or "Economy"
invCont.buildByClassificationId = async function (req, res, next) {
  // grabbing the classification id from the url parameter
  const classification_id = req.params.classificationId
  // getting all vehicles that match this classification from the database
  const data = await invModel.getInventoryByClassificationId(classification_id)
  // building the html grid of vehicles using the utility function
  const grid = await utilities.buildClassificationGrid(data)
  // getting the nav bar
  let nav = await utilities.getNav()
  // getting the classification name for the page title
  const className = data.length > 0 ? data[0].classification_name : "No"
  // rendering the classification view and sending all the data to it
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
// this handles when someone clicks on a specific vehicle to see its details
invCont.buildByInvId = async function (req, res, next) {
  // getting the inventory id from the url
  const inv_id = req.params.invId
  // getting the vehicle data from the database
  const data = await invModel.getInventoryByInvId(inv_id)
  // building the detail html using the utility function
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  // making the title show the year make and model of the vehicle
  const vehicleName = data
    ? data.inv_year + " " + data.inv_make + " " + data.inv_model
    : "Vehicle Not Found"
  // rendering the detail view with all the vehicle info
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

/* ***************************
 *  Trigger intentional error (500)
 * ************************** */
// this is the intentional error for assignment 3
// when someone clicks the footer link it throws a error on purpose
invCont.triggerError = async function (req, res, next) {
  throw new Error("Oh no! There was a crash. Maybe try a different route?")
}

module.exports = invCont
