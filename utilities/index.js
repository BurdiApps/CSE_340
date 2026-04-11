// bringing in the inventory model so we can get data from the database
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
// creating empty object to store all our utility functions
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
// this function builds the navigation bar dynamically from the database
Util.getNav = async function () {
  // getting all classifications from the db
  let data = await invModel.getClassifications()
  // starting the unordered list html string
  let list = '<ul class="nav-list">'
  // adding the home link first since its always there
  list += '<li><a href="/" title="Home page">Home</a></li>'
  // looping thru each classification and adding a link for it
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  // returning the finished html string back to whoever called this function
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
// this takes the array of vehicles and builds a html grid to display them
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    // looping thru each vehicle and creating a list item with image, name and price
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      // formatting the price with commas and dollar sign using Intl.NumberFormat
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    // if there's no vehicles show a message instead
    grid =
      '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
// this builds the html for a single vehicle detail page
// shows the full size image, price, description, color and miles
Util.buildVehicleDetail = async function (data) {
  let detail
  if (data) {
    // creating a div with image on one side and info on the other
    detail = '<div class="vehicle-detail">'
    detail += '<div class="detail-image">'
    // using the full size image not the thumbnail
    detail +=
      '<img src="' +
      data.inv_image +
      '" alt="' +
      data.inv_year +
      " " +
      data.inv_make +
      " " +
      data.inv_model +
      '" />'
    detail += "</div>"
    detail += '<div class="detail-info">'
    detail +=
      "<h2>" +
      data.inv_year +
      " " +
      data.inv_make +
      " " +
      data.inv_model +
      " Details</h2>"
    // formatting price with dollar sign and commas
    detail +=
      '<p class="detail-price"><strong>Price: </strong>$' +
      new Intl.NumberFormat("en-US").format(data.inv_price) +
      "</p>"
    detail +=
      '<p class="detail-description"><strong>Description: </strong>' +
      data.inv_description +
      "</p>"
    detail +=
      '<p class="detail-color"><strong>Color: </strong>' +
      data.inv_color +
      "</p>"
    // formatting miles with commas too
    detail +=
      '<p class="detail-miles"><strong>Miles: </strong>' +
      new Intl.NumberFormat("en-US").format(data.inv_miles) +
      "</p>"
    detail += "</div>"
    detail += "</div>"
  } else {
    // if no vehicle was found show a message
    detail =
      '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
// this is a higher order function that wraps other functions in a try-catch basically
// if the function works fine it resolves the promise, if it fails it catches the error
// and passes it to the express error handler using next
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Build classification select list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Account Type (Employee or Admin)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access this resource.")
    return res.redirect("/account/login")
  }
}

module.exports = Util
