const express = require("express");
const { createUser, getAllUser, getUserbyId, editUser, deleteUser } = require("../controllers/User-contoller"); // Perbaikan nama file controller
const { PythonShell } = require("python-shell");
const User = require("../models/User");
const route = express.Router();
const { Types, default: mongoose } = require('mongoose')

route.post("/", createUser);
route.get("/", getAllUser);
route.get("/:id", getUserbyId);
route.put("/:id", editUser);
route.delete("/:id", deleteUser);

route.post("/process-data/:id", async (req, res) => { // Tambahkan async karena menggunakan await
  const id = req.params.id;

  let options = {
    args: [id]
  };

  // Memanggil skrip Python dengan PythonShell
  try {
    let objectId = typeof (id);
    console.log('ObjectId yang valid:', objectId);
    const messages = await PythonShell.run('controllers/knn.py', options)
    const processedData = messages.toString();
    console.log("Processed Data:", processedData);

    const kaloriData = JSON.parse(messages[0]);
    const kalori = (kaloriData["Kalori Harian"].replace(",", ""));
    console.log("Kalori:", kalori);
    const user = await User.findByIdAndUpdate(id, { // Perbaikan penggunaan id
      ...req.body,
      kaloriHarian: kalori,
    }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "id tidak ditemukan",
      });
    } else {
      res.status(200).json({
        status: "oke",
        message: "berhasil mengubah data",
        data: user,
        // data: JSON.parse(messages),
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Terjadi kesalahan dalam pemrosesan data.",
      error: err.message,
    });
  }
});

module.exports = {
  userRoute: route,
};
