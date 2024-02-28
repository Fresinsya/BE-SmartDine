const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');

// Definisikan route untuk menjalankan fungsi utama
route.post('/generate', async (req, res) => {
    try {
        const search = req.query.search || [];
        const idUser = req.body.IdUser; // Menggunakan req.body untuk mendapatkan IdUser dari body request

        // Lakukan pencarian menu
        const searchResult = await searchMenu(search);

        if (!searchResult || searchResult.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Generate menu harian dari hasil pencarian
        const dailyMenus = await generateDailyMenu(searchResult);

        // Simpan data ke dalam skema RandomMenu
        const randomMenuData = {
            IdUser: idUser,
            data: dailyMenus // Menyimpan data hasil generateDailyMenu
        };

        // Simpan data ke dalam skema RandomMenu
        await RandomMenu.create(randomMenuData);

        console.log("Random menus generated successfully");
        res.status(200).json({ message: 'Random menus generated successfully', data: randomMenuData });
    } catch (error) {
        console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    searchMenuRoute: route,
}