const express = require("express");
const { createUser, getAllUser, getUserbyId, editUser, deleteUser } = require("../controllers/User-contoller");
const route = express.Router();

route.post("/", createUser)
route.get("/", getAllUser)
route.get("/:id", getUserbyId)
route.put("/:id", editUser)
route.delete("/:id", deleteUser)

module.exports = {
  userRoute: route,
};