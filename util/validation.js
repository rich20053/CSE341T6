const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    // firstName must be at least 2 chars long
    body('firstName').isLength({ min: 2 }),
    // lastName must be at least 2 chars long
    body('lastName').isLength({ min: 2 }),
    // must be an email
    body('email').isEmail(),
    // favoriteColor must be at least 3 chars long
    body('favoriteColor').isLength({ min: 3 }),
    // must be a date
    body('birthday').isDate()
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}