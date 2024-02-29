const express = require("express");
const { getAllRandomMenu, getRandomById, editRandomMenuByIdUser, deleteRandomMenuById } = require("../controllers/randomMenu.controllers");
const route = express.Router();

// route.get("/", generateRandomMenu);
route.get("/", getAllRandomMenu)
route.get("/:id", getRandomById)
route.put("/:id", editRandomMenuByIdUser)
route.delete("/:id", deleteRandomMenuById)

module.exports = {
    randomMenuRoute: route
}