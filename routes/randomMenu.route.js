const express = require("express");
const { getAllRandomMenu, getRandomById, editRandomMenuByIdUser, deleteRandomMenuById, deleteFullMenu } = require("../controllers/randomMenu.controllers");
const route = express.Router();

// route.get("/", generateRandomMenu);
route.get("/", getAllRandomMenu)
route.get("/:id", getRandomById)
route.put("/:id", editRandomMenuByIdUser)
route.delete("/:id", deleteRandomMenuById)
route.delete("/", deleteFullMenu)

module.exports = {
    randomMenuRoute: route
}