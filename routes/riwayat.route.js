const express = require("express");
const { getAllRiwayat, createRiwayat, getRiwayatbyId, editRiwayat, getRiwayatByIdUser, editRiwayatiduser, deleteByIdUser } = require("../controllers/riwayat.controllers");
const { getRekapbyIdUser, getAllRekapKalori, deleteByIDUser } = require("../controllers/rekap_kalori.constrollers");
const route = express.Router();


route.post("/", createRiwayat)
route.get("/", getAllRiwayat)
route.get("/rekap/:id", getRekapbyIdUser)
route.get("/rekap/", getAllRekapKalori)
route.get("/:id", getRiwayatbyId)
route.get("/user/:id", getRiwayatByIdUser)
// route.put("/:id", editRiwayat)
route.put("/:id", editRiwayatiduser)
route.delete("/:id", deleteByIdUser)
route.delete("/rekap/:id", deleteByIDUser)

module.exports = {
    riwayatRoute: route
}