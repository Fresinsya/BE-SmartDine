const HistoryMakan = require('../models/History_makan');
const Menu = require('../models/Menu');

module.exports = {
    getAllHistoryMakan: async (req, res) => {
        try {
            const historyMakan = await HistoryMakan.find();
            return res.status(200).json({ "status": "oke", "message": "berhasil mendapatkan data", "data": historyMakan });
        } catch (error) {
            return res.status(500).json({ "status": "Error", "message": "gagal mendapatkan data", "error": error.message});
        }
    },
    getHistoryMakanbyId: async (req, res) => {
        const id = req.params.id;
        try {
            const historyMakan = await HistoryMakan.findById(id);
            if (!historyMakan) {
                return res.status(404).json({ message: "id tidak ditemukan" });
            }
            return res.status(200).json({"status": "oke", "message": "berhasil mendapatkan data", "data": historyMakan});
        } catch (error) {
            return res.status(500).json({"status": "Error", "message": "gagal mendapatkan data", "error": error.message});
        }
    },
    createHistoryMakan : async (req, res) => {
        const { id_menu, tgl_mulai, tgl_selesai, id_user } = req.body;
        try {
            // Mengambil informasi menu dari tabel "Menu" berdasarkan ID yang diberikan
            const menu = await Menu.findById(id_menu);
    
            if (!menu) {
                return res.status(404).json({ message: "Menu not found" });
            }
    
            // Membuat objek HistoryMakan dengan menggunakan informasi menu yang ditemukan
            const historyMakan = await HistoryMakan.create({
                // menu_history: menu.menu,
                id_user: id_user,
                id_menu: id_menu,
                tgl_mulai: tgl_mulai,
                tgl_selesai: tgl_selesai
            });
            
            return res.status(201).json({ "status": "oke", "message": "berhasil menambahkan data history makan", "data": historyMakan });
        } catch (error) {
            return res.status(500).json({ "status": "Error", "message": "gagal menambahkan data history makan", "error": error.message });
        }
    },
    editHistoryMakan: async (req, res) => {
        const id = req.params.id;
        try {
            const historyMakan = await HistoryMakan.findByIdAndUpdate
                (id, req.body, { new: true });
            return res.status(200).json(historyMakan);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteHistoryMakan: async (req, res) => {
        const id = req.params.id;
        try {
            const historyMakan = await HistoryMakan.findByIdAndDelete(id);
            return res.status(200).json(historyMakan);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
}