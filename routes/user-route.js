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

    const rekap = await RekapKalori.findOne({ IdUser: id, tgl_selesai: { $gt: new Date() } }).sort({ tgl_selesai: 1 });
    if (rekap) {
      const today = new Date();
      const tglSelesai = rekap.tgl_selesai;
      if (today > tglSelesai || today === tglSelesai) {
        const messages = await PythonShell.run('controllers/knn.py', options);
        const processedData = messages.toString();
        console.log("Processed Data:", processedData);

        let Data;
        try {
          Data = JSON.parse(processedData);
        } catch (jsonErr) {
          throw new Error("Invalid JSON format returned from Python script: " + jsonErr.message);
        }

        const kalori = Data["Kalori Harian"].replace(",", "");
        console.log("Kalori:", kalori);

        const user = await User.findByIdAndUpdate(id, {
          ...req.body,
          kaloriHarian: kalori + " Kkal",
        }, { new: true });

        const BMR = Data["BMR"].replace(",", "");
        const TDEE = Data["TDEE"].replace(",", "");
        const NObeyesdad = Data["NObeyesdad"];
        console.log("BMR:", BMR);
        console.log("TDEE:", TDEE);
        console.log("NObeyesdad:", NObeyesdad);

        const riwayat = await Riwayat.findOneAndUpdate({ IdUser: id }, {
          ...req.body,
          BMR: BMR,
          TDEE: TDEE,
          NObeyesdad: NObeyesdad,
        });

        const Defisit = Data["Defisit Kalori"].replace(",", "");
        let rekapKalori;

        rekapKalori = await RekapKalori.create({
          IdUser: id,
          total_kalori_harian: kalori,
          BMR: BMR,
          TDEE: TDEE,
          Defisit: Defisit,
        });
        console.log('Rekap kalori berhasil dibuat:', rekapKalori);

        res.status(200).json({
          status: "oke",
          message: "berhasil mengubah data",
          data: rekapKalori,
        });
      } else {
        res.status(400).json({
          status: "Error",
          message: "Proses tidak dapat dilakukan karena tgl_selesai belum terlampaui",
        });
      }
    } else {
      const messages = await PythonShell.run('controllers/knn.py', options);
      const processedData = messages.toString();
      console.log("Processed Data:", processedData);

      let Data;
      try {
        Data = JSON.parse(processedData);
      } catch (jsonErr) {
        throw new Error("Invalid JSON format returned from Python script: " + jsonErr.message);
      }

      const kalori = Data["Kalori Harian"].replace(",", "");
      console.log("Kalori:", kalori);

      const user = await User.findByIdAndUpdate(id, {
        ...req.body,
        kaloriHarian: kalori,
      }, { new: true });

      const BMR = Data["BMR"].replace(",", "");
      const TDEE = Data["TDEE"].replace(",", "");
      const NObeyesdad = Data["NObeyesdad"];
      console.log("BMR:", BMR);
      console.log("TDEE:", TDEE);
      console.log("NObeyesdad:", NObeyesdad);

      const riwayat = await Riwayat.findOneAndUpdate({ IdUser: id }, {
        ...req.body,
        BMR: BMR,
        TDEE: TDEE,
        NObeyesdad: NObeyesdad,
      });

      const Defisit = Data["Defisit Kalori"].replace(",", "");
      let rekapKalori;

      rekapKalori = await RekapKalori.create({
        IdUser: id,
        total_kalori_harian: kalori,
        BMR: BMR,
        TDEE: TDEE,
        Defisit: Defisit,
      });
      console.log('Rekap kalori berhasil dibuat:', rekapKalori);

      res.status(200).json({
        status: "oke",
        message: "berhasil menambahkan data",
        data: rekapKalori,
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
