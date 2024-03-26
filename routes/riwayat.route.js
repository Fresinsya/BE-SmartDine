const express = require("express");
const { getAllRiwayat, createRiwayat, getRiwayatbyId, editRiwayat, getRiwayatByIdUser, editRiwayatiduser } = require("../controllers/riwayat.controllers");
const { getRekapbyIdUser, getAllRekapKalori, deleteByIDUser } = require("../controllers/rekap_kalori.constrollers");
const route = express.Router();


route.get("/", getAllRiwayat)
route.get("/rekap/:id", getRekapbyIdUser)
route.get("/rekap/", getAllRekapKalori)
route.get("/:id", getRiwayatbyId)
route.get("/user/:id", getRiwayatByIdUser)
route.post("/", createRiwayat)
// route.put("/:id", editRiwayat)
route.put("/:id", editRiwayatiduser)
route.delete("/rekap/:id", deleteByIDUser)

module.exports = {
    riwayatRoute: route
}