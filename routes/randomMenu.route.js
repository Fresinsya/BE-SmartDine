const express = require("express");
const { getAllRandomMenu, getRandomById, editRandomMenuByIdUser, deleteRandomMenuById, deleteFullMenu, getRandomDayAndIdUser, getRandomBy_id } = require("../controllers/randomMenu.controllers");
const route = express.Router();

// route.get("/", generateRandomMenu);
route.get("/", getAllRandomMenu)
route.get("/:id", getRandomById)
route.get("/:id/:IdMenu", getRandomBy_id)
route.get("/:id/:day/:paket", getRandomDayAndIdUser)
route.put("/:id", editRandomMenuByIdUser)
route.delete("/:id", deleteRandomMenuById)
route.delete("/", deleteFullMenu)

module.exports = {
    randomMenuRoute: route
}