const express = require("express");
const { getAllRiwayat, createRiwayat, getRiwayatbyId, editRiwayat, getRiwayatByIdUser, editRiwayatiduser } = require("../controllers/riwayat.controllers");
const route = express.Router();


route.get("/", getAllRiwayat)
route.get("/:id", getRiwayatbyId)
route.get("/user/:id", getRiwayatByIdUser)
route.post("/", createRiwayat)
// route.put("/:id", editRiwayat)
route.put("/:id", editRiwayatiduser)

module.exports = {
    riwayatRoute: route
}