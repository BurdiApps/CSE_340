const pool = require("../database/")

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql =
      "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get reviews by inv_id
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname 
       FROM review r 
       JOIN account a ON r.account_id = a.account_id 
       WHERE r.inv_id = $1 
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    throw new Error("No reviews found")
  }
}

/* ***************************
 *  Get reviews by account_id
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
       FROM review r 
       JOIN inventory i ON r.inv_id = i.inv_id 
       WHERE r.account_id = $1 
       ORDER BY r.review_date DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    throw new Error("No reviews found")
  }
}

/* ***************************
 *  Get review by review_id
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM review WHERE review_id = $1",
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    throw new Error("Review not found")
  }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_text, review_id) {
  try {
    const sql =
      "UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [review_text, review_id])
    return data.rows[0]
  } catch (error) {
    throw new Error("Update failed")
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1"
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    throw new Error("Delete failed")
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
}
