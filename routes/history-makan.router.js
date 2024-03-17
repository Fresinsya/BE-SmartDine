const express = require("express");
const { deleteHistoryMakan, getHistoryMakanbyIdUser, editHistoryMakanByIdUser } = require("../controllers/history_makan.controllers");
const route = express.Router();


route.get("/:id", getHistoryMakanbyIdUser);
route.put("/:id", editHistoryMakanByIdUser);
route.delete("/:id", deleteHistoryMakan);

module.exports = {
    historyMakanRoute: route
}