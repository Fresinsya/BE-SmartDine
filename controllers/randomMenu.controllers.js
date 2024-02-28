const History_makan = require("../models/History_makan");
const Menu = require("../models/Menu");
const RandomMenu = require("../models/RandomMenu");

module.exports = {
    generateRandomMenu: async (req, res) => {
        const { dailyCalories, id_user } = req.body;
        const days = 6;
        const menusForThisDay = 3;
        const selectedMenus = [];

        try {
            // Lakukan pencarian menu
            const searchResult = await searchMenu(req.query.jenisBahan);

            // Cek apakah ada hasil dari pencarian menu
            if (!searchResult || searchResult.length === 0) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Menu tidak ditemukan.'
                });
            }

            // Lakukan iterasi untuk memilih menu untuk setiap hari
            for (let day = 1; day <= days; day++) {
                const dailyMenu = [];

                // Pilih satu menu sarapan secara acak dari hasil pencarian
                const breakfastMenu = searchResult.find(menu => menu.waktu_makan.includes('Sarapan'));
                if (breakfastMenu) {
                    dailyMenu.push(breakfastMenu);
                }

                // Pilih menu lainnya untuk hari ini
                for (let i = 1; i < menusForThisDay; i++) {
                    const randomMenu = searchResult[Math.floor(Math.random() * searchResult.length)];
                    dailyMenu.push(randomMenu);
                }

                // Tambahkan menu-menu untuk hari ini ke daftar menu terpilih
                selectedMenus.push({
                    day: day,
                    menus: dailyMenu
                });
            }

            // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
            const randomMenus = selectedMenus.map(menu => ({
                id_user: id_user,
                day: menu.day,
                menus: menu.menus
            }));

            await RandomMenu.create(randomMenus);

            return res.status(200).json({
                status: 'Success',
                message: 'Random menus generated successfully',
                data: selectedMenus
            });
        } catch (error) {
            return res.status(500).json({ status: 'Error', message: error.message });
        }
    }
}
