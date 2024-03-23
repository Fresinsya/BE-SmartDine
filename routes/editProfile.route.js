const express = require("express");
const { editProfile, editGambarMenu, editProfileAdmin } = require("../controllers/editProfile.controllers");
const route = express.Router();

route.post("/:id", editProfile);
route.post("/admin/:id", editProfileAdmin);
route.post("/menu/:id", editGambarMenu);

module.exports = {
    editProfileRoute: route
}