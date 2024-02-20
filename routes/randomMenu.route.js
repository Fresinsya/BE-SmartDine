const express = require("express");
const { generateRandomMenu } = require("../controllers/randomMenu.controllers");
const route = express.Router();

route.get("/", generateRandomMenu);

module.exports = {
    randomMenuRoute: route
}