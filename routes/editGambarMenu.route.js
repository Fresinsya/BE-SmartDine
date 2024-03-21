const express = require("express");
const { editGambarMenu } = require("../controllers/UploadGambarMenu.controllers");

const route = express.Router();

route.post("/:id", editGambarMenu);

module.exports = {
    editGambarMenuRoute: route
}