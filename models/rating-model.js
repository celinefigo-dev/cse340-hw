const pool = require("../database")

//insert rating
async function addRating(vehicle_id, account_id, rating_value) {
  try {
    const sql = `INSERT INTO vehicle_ratings (vehicle_id, account_id, rating_value) 
                 VALUES ($1, $2, $3) RETURNING *`
    const result = await pool.query(sql, [vehicle_id, account_id, rating_value])
    return result.rows[0]
  } catch (error) {
    throw new Error("Error al agregar la calificación: " + error.message)
  }
}

//average rating
async function getAverageRating(vehicle_id) {
  try {
    const sql = `SELECT ROUND(AVG(rating_value), 1) AS average 
                 FROM vehicle_ratings WHERE vehicle_id = $1`
    const result = await pool.query(sql, [vehicle_id])
    return result.rows[0].average || 0
  } catch (error) {
    throw new Error("Error al obtener el promedio: " + error.message)
  }
}

module.exports = { addRating, getAverageRating }