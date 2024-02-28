const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');

// Definisikan route untuk menjalankan fungsi utama
route.post('/generate', async (req, res) => {
    try {
        const { IdUser } = req.body; // Extract IdUser from the request body

        let search = req.query.search || [];
        
        // Perform menu search
        const searchResult = await searchMenu(search);

        if (!searchResult || searchResult.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Generate daily menus from the search result
        const dailyMenus = await generateDailyMenu(searchResult);

        // Map daily menus to the structure expected by RandomMenuModel
        const randomMenus = dailyMenus.map((menus, day) => ({
            IdUser, // Use the extracted IdUser
            day: day + 1,
            menus: menus.map(menu => ({
                id_menu: menu._id,
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

        // Save the data into the RandomMenu model
        await RandomMenu.create(randomMenus);

        console.log("Random menus generated successfully");
        res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
    } catch (error) {
        console.error("Failed to search or generate menus:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    searchMenuRoute: route,
}