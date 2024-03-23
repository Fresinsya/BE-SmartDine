const express = require("express");
const { createAdmin, getAdminById, editAdminById, deleteAdminById } = require("../controllers/admin.controller");
const route = express.Router();

route.post("/", createAdmin);
// route.get("/", getAllAdmin);
route.get("/:id", getAdminById);
route.put("/:id", editAdminById);
route.delete("/:id", deleteAdminById);



module.exports = {
  adminRoute: route,
};
