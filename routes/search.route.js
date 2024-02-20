const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');

// Definisikan route untuk menjalankan fungsi utama
route.get('/generate', async (req, res) => {
    try {

        let search = req.query.search || [];
        let jenisBahan = req.query.jenisBahan || "All";

        
        // Lakukan pencarian menu
        const searchResult = await searchMenu(search, jenisBahan);


        if (!searchResult || searchResult.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Generate menu harian dari hasil pencarian
        const dailyMenus = await generateDailyMenu(searchResult);

        // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
        const randomMenus = dailyMenus.map((menus, day) => ({
            day: day + 1,
            menus: menus.map(menu => ({
                menu: menu.menu,
                bahan: menu.bahan,
                cara_masak: menu.cara_masak,
                kalori_makanan: menu.kalori_makanan,
                waktu_makan: menu.waktu_makan,
                avatar: menu.avatar,
                jenis_bahan: menu.jenis_bahan,
                berat_makanan: menu.berat_makanan
            }))
        }));

        // // Simpan data ke dalam skema RandomMenu
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