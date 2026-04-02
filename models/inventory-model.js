// bringing in the database connection so we can run queries
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
// this function gets all the classifications from the db for the navbar
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
// this gets all the vehicles that belong to a specific classification
// uses a prepared statement with $1 to prevent sql injection
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    // returning just the rows array since there's multiple items
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get a specific inventory item by inv_id
 * ************************** */
// this gets one specific vehicle by its id for the detail page
// also uses prepared statement with $1 for security
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    // only returning the first element since it's just one vehicle
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}

// exporting all the functions so the controller can use them
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
}
