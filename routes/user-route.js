const express = require("express");
const { createUser, getAllUser, getUserbyId, editUser, deleteUser } = require("../controllers/User-contoller"); // Perbaikan nama file controller
const { PythonShell } = require("python-shell");
const User = require("../models/User");
const route = express.Router();
const { Types, default: mongoose } = require('mongoose');
const Riwayat = require("../models/Riwayat");
const RekapKalori = require("../models/RekapKalori");

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
    const tglInput = Riwayat.tgl_input;

    // Hitung perbedaan waktu antara tgl_input dan tanggal saat ini
    const today = new Date();
    const diffInTime = today.getTime() - new Date(tglInput).getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays >= 1) {
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
      const NObeyesdad = (Data["NObeyesdad"]);
      console.log("BMR:", BMR);
      console.log("TDEE:", TDEE);
      console.log("NObeyesdad:", NObeyesdad);
      const riwayat = await Riwayat.findOneAndUpdate({ IdUser: id }, {
        ...req.body,
        BMR: BMR,
        TDEE: TDEE,
        NObeyesdad: NObeyesdad,
      });

      const Defisit = (Data["Defisit Kalori"].replace(",", ""));
      let rekapKalori; // Definisikan variabel rekapKalori di dalam blok if

      // Cek apakah perbedaan waktu sudah mencapai 1 hari
      rekapKalori = await RekapKalori.create({
        IdUser: id,
        total_kalori_harian: kalori,
        BMR: BMR,
        TDEE: TDEE,
        Defisit: Defisit,
      });
      console.log('Rekap kalori berhasil dibuat:', rekapKalori);

      if (!user || !riwayat) {
        return res.status(404).json({
          message: "id tidak ditemukan",
        });
      } else {
        res.status(200).json({
          status: "oke",
          message: "berhasil mengubah data",
          data: rekapKalori, // Gunakan nilai rekapKalori yang didefinisikan di dalam blok try-catch
        });
      }
    } else {
      console.log('Tidak dapat membuat rekap kalori. Tanggal input harus lebih dari 1 hari yang lalu.');
      return res.status(400).json({
        message: "Tidak dapat membuat rekap kalori. Tanggal input harus lebih dari 1 hari yang lalu.",
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
