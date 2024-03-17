const History_makan = require('../models/History_makan');
const HistoryMakan = require('../models/History_makan');
const Menu = require('../models/Menu');
const { generateDailyMenu } = require('./search.controllers');

module.exports = {
    getHistoryMakanbyIdUser: async (req, res) => {
        const id = req.params.id;
        try {
            const historyMakan = await History_makan.find({ id_user: id });
            if (!historyMakan) {
                return res.status(404).json({ message: "id tidak ditemukan" });
            }
            return res.status(200).json({ "status": "oke", "message": "berhasil mendapatkan data", "data": historyMakan });
        } catch (error) {
            return res.status(500).json({ "status": "Error", "message": "gagal mendapatkan data", "error": error.message });
        }
    },
    editHistoryMakanByIdUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deleteMenu = await History_makan.deleteMany({ IdUser: id });
            // randommenu
            let search = req.query.search || [];

            // Lakukan pencarian menu
            const searchResult = await searchMenu(search);

            if (!searchResult || searchResult.length === 0) {
                console.log("Menu tidak ditemukan.");
                res.status(404).json({ message: 'Menu tidak ditemukan' });
                return;
            }

            // Generate menu harian dari hasil pencarian
            const dailyMenus = await generateDailyMenu(searchResult);

            // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
            const HistoryMakan = dailyMenus.map((menus, day) => ({
                tgl_mulai: new Date(),
                tgl_selesai: date_selesai,
                id_user: req.body.IdUser,
                menus: menus.map(menu => ({
                    day: day + 1,
                    id_menu: menu._id,
                    menu: menu.menu,
                }))
            }));

            // Simpan data ke dalam skema RandomMenu
            await History_makan.create(HistoryMakan);

            console.log("Random menus generated successfully");
            res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mendapatkan data",
                error: error.message,
            });
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