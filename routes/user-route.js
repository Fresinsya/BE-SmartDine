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

    const riwayat = await Riwayat.findOne({ IdUser: id });

    // Jika riwayat tidak ditemukan, lakukan pengolahan data
    if (!riwayat) {
      let objectId = typeof (id);
      console.log('ObjectId yang valid:', objectId);
      const messages = await PythonShell.run('controllers/knn.py', options);
      const processedData = messages.toString();
      console.log("Processed Data:", processedData);

      const Data = JSON.parse(messages[0]);
      const kalori = (Data["Kalori Harian"].replace(",", ""));
      console.log("Kalori:", kalori);
      const user = await User.findByIdAndUpdate(id, {
        ...req.body,
        kaloriHarian: kalori,
      }, { new: true });

      const BMR = (Data["BMR"].replace(",", ""));
      const TDEE = (Data["TDEE"].replace(",", ""));
      const NObeyesdad = (Data["NObeyesdad"]);
      console.log("BMR:", BMR);
      console.log("TDEE:", TDEE);
      console.log("NObeyesdad:", NObeyesdad);
      const newRiwayat = await Riwayat.findOneAndUpdate({ IdUser: id }, {
        ...req.body,
        BMR: BMR,
        TDEE: TDEE,
        NObeyesdad: NObeyesdad,
      }, { upsert: true, new: true });

      const Defisit = (Data["Defisit Kalori"].replace(",", ""));
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
      // Jika riwayat ditemukan, cek tgl_selesai
      const today = new Date();
      const tglSelesai = new Date(riwayat.tgl_selesai);
      if (today.getFullYear() > tglSelesai.getFullYear() ||
        (today.getFullYear() === tglSelesai.getFullYear() && today.getMonth() > tglSelesai.getMonth()) ||
        (today.getFullYear() === tglSelesai.getFullYear() && today.getMonth() === tglSelesai.getMonth() && today.getDate() > tglSelesai.getDate())) {
        // Tgl_selesai belum terlampaui, kirim respon error
        return res.status(400).json({
          message: "Tgl_selesai belum terlampaui",
        });
      } else {
        // Tgl_selesai sudah terlampaui, jalankan proses yang sama seperti ketika riwayat tidak ditemukan
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
      }
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
