const express = require("express");
const { editProfile, editGambarMenu } = require("../controllers/editProfile.controllers");
const route = express.Router();

route.post("/:id", editProfile);
route.post("/menu/:id", editGambarMenu);

module.exports = {
    editProfileRoute: route
}