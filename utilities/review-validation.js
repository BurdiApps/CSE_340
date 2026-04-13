const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Review text must be at least 5 characters."),
  ]
}

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please fix the errors below.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

module.exports = validate
