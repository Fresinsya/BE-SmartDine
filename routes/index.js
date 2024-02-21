const express = require("express");
const route = express.Router();
const {userRoute} = require("./user-route");
const {authRoute} = require("./auth.route");
const {riwayatRoute} = require("./riwayat.route");
const {menuRoute} = require("./menu.route");
const { historyMakanRoute } = require("./history-makan.router");
const {randomMenuRoute} = require("./randomMenu.route");
const { searchMenuRoute } = require("./search.route");

route.get("/", (req, res) => {
    res.json("apiSmartDine")
})

route.use("/user", userRoute)
route.use("/", authRoute)
route.use("/riwayat", riwayatRoute)
route.use("/menu", menuRoute)
route.use("/historymakan", historyMakanRoute)
route.use("/random", randomMenuRoute)
route.use("/search", searchMenuRoute)

module.exports = route