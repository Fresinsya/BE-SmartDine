const express = require("express");
const { editProfile } = require("../controllers/editProfile.controllers");
const route = express.Router();

route.post("/:id", editProfile);

module.exports = {
    editProfileRoute: route
}