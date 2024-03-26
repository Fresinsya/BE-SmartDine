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
    if (!riwayat) {
      return res.status(404).json({
        status: "Error",
        message: "Riwayat tidak ditemukan",
      });
    }

    // Lakukan pengecekan data user
    if (!riwayat.FACV || !riwayat.FCVC || !riwayat.NCP || !riwayat.CAEC || !riwayat.CH20 || !riwayat.SCC || !riwayat.FAF || !riwayat.TUE || !riwayat.CALC || !riwayat.MTRANS) {
      return res.status(400).json({
        status: "Error",
        message: "Data Riwayat tidak lengkap",
      });
    }

    const rekap = await RekapKalori.findOne({ IdUser: id, tgl_selesai: { $gt: new Date() } }).sort({ tgl_selesai: 1 });
    if (rekap) {

      const today = new Date();
      const tglSelesai = rekap.tgl_selesai;

      if (today > tglSelesai || today === tglSelesai) {
        // Tgl_selesai sudah terlampaui, jalankan proses yang sama seperti ketika riwayat tidak ditemukan
        console.log('Tanggal selesai sudah terlampaui:', today, '>', tglSelesai)
        let objectId = typeof (id);
        console.log('ObjectId yang valid:', objectId);
        const messages = await PythonShell.run('controllers/knn.py', options);
        const processedData = messages.toString();
        console.log("Processed Data:", processedData);

        const Data = JSON.parse(messages[0]);
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

        // if (!user || !riwayat) {
        //   return res.status(404).json({
        //     message: "id tidak ditemukan",
        //   });
        // } else {
        res.status(200).json({
          status: "oke",
          message: "berhasil mengubah data",
          data: rekapKalori, // Gunakan nilai rekapKalori yang didefinisikan di dalam blok try-catch
        });
        // }
      } else {
        // Tgl_selesai belum terlampaui, kirimkan pesan ke client
        res.status(400).json({
          status: "Error",
          message: "Proses tidak dapat dilakukan karena tgl_selesai belum terlampaui",
        });
      }
    } else {
      let objectId = typeof (id);
      console.log('ObjectId yang valid:', objectId);
      const messages = await PythonShell.run('controllers/knn.py', options);
      const processedData = messages.toString();
      console.log("Processed Data:", processedData);

      const Data = JSON.parse(messages[0]);
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
        data: rekapKalori, // Gunakan nilai rekapKalori yang didefinisikan di dalam blok try-catch
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
