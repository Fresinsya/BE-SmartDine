const express = require("express");
const { login, register } = require("../controllers/auth.controller");
const route = express.Router();

route.post("/login", login)
route.post("/register", register)

module.exports = {
    authRoute: route,
};