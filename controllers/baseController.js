// bringing in the utilities file so we can use getNav and other functions
const utilities = require("../utilities/")
// creating a empty object to store our controller methods
const baseController = {}

// this builds the home page - gets the nav bar then renders the index view
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // sending the title and nav to the view so it can display them
  res.render("index", {title: "Home", nav})
}

module.exports = baseController
