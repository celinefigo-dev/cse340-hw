const pool = require("../database/")


/* ***************************
 *  Get details products items by inv_id
 * ************************** */
async function getInventoryDetailsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT
	I.INV_IMAGE,
	I.INV_THUMBNAIL,
	I.INV_YEAR,
	I.INV_MAKE,
	I.INV_MODEL,
	I.INV_PRICE,
	I.INV_DESCRIPTION,
	I.INV_COLOR,
	I.INV_MILES
FROM
	PUBLIC.INVENTORY AS I
WHERE
	I.INV_ID = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorydetailsbyid error " + error)
  }
}


module.exports = {getInventoryDetailsById};