const express = require("express");
const { createHistoryMakan, getAllHistoryMakan, getHistoryMakanbyId, editHistoryMakan, deleteHistoryMakan } = require("../controllers/history_makan.controllers");
const route = express.Router();

route.post("/", createHistoryMakan);
route.get("/", getAllHistoryMakan);
route.get("/:id", getHistoryMakanbyId);
route.put("/:id", editHistoryMakan);
route.delete("/:id", deleteHistoryMakan);

module.exports = {
    historyMakanRoute: route
}