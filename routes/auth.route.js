const express = require("express");
const { login, register, loginAdmin, registerAdmin } = require("../controllers/auth.controller");
const route = express.Router();

route.post("/login", login)
route.post("/register", register)
route.post("/loginAdmin", loginAdmin)
route.post("/registerAdmin", registerAdmin)


module.exports = {
    authRoute: route,
};