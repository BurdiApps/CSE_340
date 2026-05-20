const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

// Process adding a review (must be logged in)
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Route to build edit review view (must be logged in)
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildEditReview))

// Process review update (must be logged in)
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
)

// Route to build delete review confirmation view (must be logged in)
router.get("/delete/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildDeleteReview))

// Process review delete (must be logged in)
router.post("/delete", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview))

module.exports = router
