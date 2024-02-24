const express = require("express");
const { getAllRiwayat, createRiwayat, getRiwayatbyId, editRiwayat, getRiwayatByIdUser } = require("../controllers/riwayat.controllers");
const route = express.Router();


route.get("/", getAllRiwayat)
route.get("/:id", getRiwayatbyId)
route.get("/user/:id", getRiwayatByIdUser)
route.post("/", createRiwayat)
route.put("/:id", editRiwayat)

module.exports = {
    riwayatRoute: route
}