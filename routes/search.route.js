const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');

// Definisikan route untuk menjalankan fungsi utama
route.post('/generate', async (req, res) => {
    try {
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

        let date_selesai = new Date(); // Nilai default, Anda dapat mengganti ini sesuai kebutuhan
        date_selesai.setDate(date_selesai.getDate() + 6); // Tambahkan 6 hari

        // Jika bulan selesai berbeda dengan bulan tanggal makan
        if (date_selesai.getMonth() !== date_selesai.getMonth()) {
            // Hitung sisa hari dalam bulan tanggal makan
            const sisaHari = new Date(date_selesai.getFullYear(), date_selesai.getMonth() + 1, 0).getDate() - date_selesai.getDate();
            // Tambahkan sisa hari ke tanggal selesai
            date_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
        }

        // Simpan tanggal selesai ke dalam objek req.body
        req.body.date_selesai = date_selesai;

        // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
        const randomMenus = dailyMenus.map((menus, day) => ({
            IdUser: req.body.IdUser, // Mengambil IdUser dari req.body
            day: day + 1,
            Date: new Date(),
            Date_selesai: date_selesai,
            menus: menus.map(menu => ({
                id_menu: menu._id,
                menu: menu.menu,
                bahan: menu.bahan,
                cara_masak: menu.cara_masak,
                kalori_makanan: menu.kalori_makanan,
                waktu_makan: menu.waktu_makan,
                avatar: menu.avatar,
                jenis_bahan: menu.jenis_bahan,
                berat_makanan: menu.berat_makanan,
                day: day + 1 // Menambahkan properti day di dalam objek menu
            }))
        }));

        // Simpan data ke dalam skema RandomMenu
        await RandomMenu.create(randomMenus);

        console.log("Random menus generated successfully");
        res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
    } catch (error) {
        console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    searchMenuRoute: route,
}