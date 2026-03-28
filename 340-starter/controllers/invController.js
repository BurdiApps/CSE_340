const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data.length > 0 ? data[0].classification_name : "No"
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = data
    ? data.inv_year + " " + data.inv_make + " " + data.inv_model
    : "Vehicle Not Found"
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

/* ***************************
 *  Trigger intentional error (500)
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Oh no! There was a crash. Maybe try a different route?")
}

module.exports = invCont
