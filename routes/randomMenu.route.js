const express = require("express");
const { generateRandomMenu, getAllRandomMenu } = require("../controllers/randomMenu.controllers");
const route = express.Router();

// route.get("/", generateRandomMenu);
route.get("/", getAllRandomMenu)

module.exports = {
    randomMenuRoute: route
}