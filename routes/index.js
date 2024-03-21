const express = require("express");
const route = express.Router();
const {userRoute} = require("./user-route");
const {authRoute} = require("./auth.route");
const {riwayatRoute} = require("./riwayat.route");
const {menuRoute} = require("./menu.route");
const { historyMakanRoute } = require("./history-makan.router");
const {randomMenuRoute} = require("./randomMenu.route");
const { searchMenuRoute } = require("./search.route");
const {editProfileRoute} = require("./editProfile.route");
const { mealPlanningRoute } = require("./meal_planning.route");
const {editGambarMenuRoute} = require("./editGambarMenu.route");

route.get("/", (req, res) => {
    res.json("apiSmartDine")
})

route.use("/", authRoute)
route.use("/editProfile", editProfileRoute)
route.use("/editGambarMenu", editGambarMenuRoute)
route.use("/user", userRoute)
route.use("/riwayat", riwayatRoute)
route.use("/menu", menuRoute)
route.use("/historymakan", historyMakanRoute)
route.use("/random", randomMenuRoute)
route.use("/search", searchMenuRoute)
route.use("/meal", mealPlanningRoute)

module.exports = route