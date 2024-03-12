const express = require("express");
const { createUser, getAllUser, getUserbyId, editUser, deleteUser } = require("../controllers/User-contoller"); // Perbaikan nama file controller
const { PythonShell } = require("python-shell");
const User = require("../models/User");
const route = express.Router();
const { Types, default: mongoose } = require('mongoose');
const Riwayat = require("../models/Riwayat");

route.post("/", createUser);
route.get("/", getAllUser);
route.get("/:id", getUserbyId);
route.put("/:id", editUser);
route.delete("/:id", deleteUser);

route.post("/process-data/:id", async (req, res) => {
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

    const Data = JSON.parse(messages[0]);
    const kalori = (Data["Kalori Harian"].replace(",", ""));
    console.log("Kalori:", kalori);
    const user = await User.findByIdAndUpdate(id, { // Perbaikan penggunaan id
      ...req.body,
      kaloriHarian: kalori,
    }, { new: true });

    const BMR = (Data["BMR"].replace(",", ""));
    const TDEE = (Data["TDEE"].replace(",", ""));
    const NObeyesdad = (Data["NObeyesdad"].replace(",", ""));
    const riwayat = await Riwayat.findOneAndUpdate({ IdUser: mongoose.Types.ObjectId(id) }, {
      ...req.body,
      BMR: BMR,
      TDEE: TDEE,
      NObeyesdad: NObeyesdad,
    }, { new: true });

    if (!user ) {
      return res.status(404).json({
        message: "id tidak ditemukan",
      });
    } else {
      res.status(200).json({
        status: "oke",
        message: "berhasil mengubah data",
        data: user,
        // data: riwayat,
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
