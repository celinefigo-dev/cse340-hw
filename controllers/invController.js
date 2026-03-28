const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")
const ratingModel = require("../models/rating-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build dynamic by items detail view
 * ************************** */

invCont.buildDetail = async (req,res,next) => {
  const itemId = req.params.itemId; //Getting ID.
  try{
    const item = await invModel.getItemById(itemId); // function from invModel
    const itemHTML = await utilities.formatItem(item); // formatting details
    const nav = await utilities.getNav();
    const averageRating = await ratingModel.getAverageRating(itemId);

    res.render("inventory/itemDetail", {
      title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`,
      nav,
      itemHTML,
      item,
      averageRating
    });
  }catch(error){
    next(error);
  }
}

invCont.buildVehicleManager = async function (req,res, next) {
  console.log('in buildVehicleManager')
  let nav = await utilities.getNav()
  classDrop = await utilities.buildClassificationDropdown()
  res.render("./inventory/management.ejs", {
    title: 'Vehicle Management',
    nav,
    errors: null,
    classDrop,
  })
}

invCont.buildAddClass =  async function (req,res, next) {
    console.log('in buildAddClass')
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification.ejs", {
      title: 'Add New Classification',
      nav,
      errors: null,
    })
}


invCont.buildAddInv =  async function (req,res, next) {
  let nav = await utilities.getNav()
  let classDrop = await utilities.buildClassificationDropdown()
  res.render("./inventory/add-inventory.ejs", {
    title: 'Add New Inventory',
    nav,
    errors: null,
    classDrop
  })
}

/* ****************************************
*  Process Inventory
* *************************************** */
// Reminder to self: next isn't needed because pass or failure is handled!
invCont.addClass = async function(req,res){
  // console.log('in addClass')
  const {classification_name} = req.body;
  const addResult = await invModel.addInventoryClassByName(classification_name)
  
  if (addResult){
    let nav = await utilities.getNav()
    req.flash('notice',`You're classification '${classification_name}' has been added to the system.`)
    res.status(201).render("inventory/management.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash('notice', `The classification '${classification_name}' could not be added. Please try again later.`)
    res.status(501).render("inventory/managment.ejs",{
      title:"Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.addInv = async function(req,res){
  const {classification_id,inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body;
  const addResult = await invModel.addInventoryItem(classification_id,inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  if (addResult){
    let nav = await utilities.getNav()
    req.flash('notice',`The ${inv_color} ${inv_year} ${inv_make} ${inv_model} has been added successfully to inventory system.`)
    res.status(201).render("inventory/management.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let classDrop = await utilities.buildClassificationDropdown(classification_id)
    req.flash('notice', `The ${inv_color} ${inv_year} ${inv_make} ${inv_model} could not be added due to a database error. Please try again later.`)
    res.status(501).render("inventory/add-inventory.ejs",{
      title:"Add New Inventory",
      nav,
      errors: null,
      classDrop,
      classification_id,
      inv_make,inv_model,
      inv_year, inv_description,
      inv_image, inv_thumbnail,
      inv_price, inv_miles,
      inv_color

    })
  }
}

// return inventory by classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId
  (classification_id)
  if(invData[0].inv_id){
    return res.json(invData)
  }else{
    next(new Error("No data returned"))
  }
}

//building edit inventory
invCont.buildEditInv = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const invItemData = await invModel.getInventoryByInventoryId(inventory_id)
  const invItem = invItemData[0]
  let classDrop = await utilities.buildClassificationDropdown(invItem.classification_id)
  const itemName = `${invItem.inv_make} ${invItem.inv_model}`
  res.render("./inventory/edit-inventory.ejs", {
    title: `Edit ${itemName}`,
    nav,
    errors: null,
    classDrop,
    inv_id: invItem.inv_id,
    inv_make: invItem.inv_make,
    inv_model: invItem.inv_model,
    inv_year: invItem.inv_year,
    inv_description: invItem.inv_description,
    inv_image: invItem.inv_image,
    inv_thumbnail: invItem.inv_thumbnail,
    inv_price: invItem.inv_price,
    inv_miles: invItem.inv_miles,
    inv_color: invItem.inv_color,
    classification_id: invItem.classification_id,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


//building delete inventory view
invCont.buildDeleteInv = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const invItemData = await invModel.getInventoryByInventoryId(inventory_id)
  const invItem = invItemData[0]
  let classDrop = await utilities.buildClassificationDropdown(invItem.classification_id)
  const itemName = `${invItem.inv_make} ${invItem.inv_model}`
  res.render("./inventory/delete-confirm.ejs", {
    title: `Delete ${itemName}`,
    nav,
    errors: null,
    classDrop,
    inv_id: invItem.inv_id,
    inv_make: invItem.inv_make,
    inv_model: invItem.inv_model,
    inv_year: invItem.inv_year,
    inv_description: invItem.inv_description,
    inv_image: invItem.inv_image,
    inv_thumbnail: invItem.inv_thumbnail,
    inv_price: invItem.inv_price,
    inv_miles: invItem.inv_miles,
    inv_color: invItem.inv_color,
    classification_id: invItem.classification_id,
  })
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id
  } = req.body
  const invIdInt = parseInt(inv_id)
  const deleteResult = await invModel.deleteInventoryitem(invIdInt)
  if (deleteResult) {
    const deleteitemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${deleteitemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}



module.exports = invCont
module.exports = invCont