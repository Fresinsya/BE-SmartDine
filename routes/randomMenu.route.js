const express = require("express");
const { getAllRandomMenu, getRandomById, editRandomMenuByIdUser } = require("../controllers/randomMenu.controllers");
const route = express.Router();

// route.get("/", generateRandomMenu);
route.get("/", getAllRandomMenu)
route.get("/:id", getRandomById)
route.put("/:id", editRandomMenuByIdUser)

module.exports = {
    randomMenuRoute: route
}