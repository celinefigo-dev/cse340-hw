const ratingModel = require("../models/rating-model")

  console.log("in rating Controller Submit Rating function")
async function submitRating(req, res) {

  const { vehicle_id, rating_value } = req.body
  const account_id = req.session.account_id
  console.log("vehicle:", vehicle_id)


  try {
    await ratingModel.addRating(vehicle_id, account_id, rating_value)
    
    req.flash('notice', "Rating Sent Successfully!")
    res.redirect(`/inv/detail/${vehicle_id}`)
  } catch (error) {
    req.flash('notice', "Error sending Rating!")
    res.redirect(`/inv/detail/${vehicle_id}`)
  }
}
module.exports = { submitRating }