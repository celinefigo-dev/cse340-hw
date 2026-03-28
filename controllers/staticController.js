// controllers/staticController.js

const staticController = {}

// Home page
staticController.buildHome = (req, res) => {
  res.send("Welcome to the Home Page 🚀")
}

// Example: About page
staticController.buildAbout = (req, res) => {
  res.send("About Page")
}

// Example: Contact page
staticController.buildContact = (req, res) => {
  res.send("Contact Page")
}

module.exports = staticController