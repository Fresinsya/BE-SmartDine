const express = require("express");
const { createMenu, getAllMenu, getMenubyId, editMenu, deleteMenu, searchMenu, generateRandomMenu } = require("../controllers/menu.controllers");
const route = express.Router();

route.post("/", createMenu);
route.get("/", getAllMenu);
route.get("/search", searchMenu);
route.get("/:id", getMenubyId);
route.put("/:id", editMenu);
route.delete("/:id", deleteMenu);

module.exports = {
    menuRoute: route
}