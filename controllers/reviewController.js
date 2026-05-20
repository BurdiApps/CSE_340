const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Add a review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { review_text, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  const result = await reviewModel.addReview(review_text, inv_id, account_id)
  if (typeof result === "string") {
    req.flash("notice", "Sorry, the review could not be added.")
  } else {
    req.flash("notice", "Review added successfully.")
  }
  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const reviewData = await reviewModel.getReviewById(review_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(reviewData.inv_id)
  const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`
  res.render("review/edit", {
    title: "Edit Review - " + itemName,
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    inv_id: reviewData.inv_id,
  })
}

/* ***************************
 *  Process review update
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  const { review_text, review_id, inv_id } = req.body
  const updateResult = await reviewModel.updateReview(review_text, parseInt(review_id))
  if (updateResult) {
    req.flash("notice", "Review updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    let nav = await utilities.getNav()
    res.status(501).render("review/edit", {
      title: "Edit Review",
      nav,
      errors: null,
      review_id,
      review_text,
      inv_id,
    })
  }
}

/* ***************************
 *  Build delete review confirmation view
 * ************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const reviewData = await reviewModel.getReviewById(review_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(reviewData.inv_id)
  const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`
  res.render("review/delete", {
    title: "Delete Review - " + itemName,
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    inv_id: reviewData.inv_id,
  })
}

/* ***************************
 *  Process review delete
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const { review_id } = req.body
  const deleteResult = await reviewModel.deleteReview(parseInt(review_id))
  if (deleteResult) {
    req.flash("notice", "Review deleted successfully.")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
  }
  res.redirect("/account/")
}

module.exports = reviewCont
