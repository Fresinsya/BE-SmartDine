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
            // Ambil semua menu
            const allMenus = await Menu.find();
    
            // Buat fungsi untuk memilih menu secara acak
            const getRandomMenu = () => {
                const randomIndex = Math.floor(Math.random() * allMenus.length);
                return allMenus[randomIndex];
            };
    
            // Lakukan iterasi untuk memilih menu untuk setiap hari
            for (let day = 1; day <= days; day++) {
                let breakfastMenu = getRandomMenu();
                // Pastikan menu sarapan terpilih memiliki waktu_makan "Sarapan"
                while (!breakfastMenu.waktu_makan.includes("Sarapan")) {
                    breakfastMenu = getRandomMenu();
                }
    
                let lunchMenu;
                let dinnerMenu;
    
                // Pilih menu "siang" dan "malam" sesuai aturan yang ditentukan
                const availableMenus = allMenus.filter(menu => {
                    return !menu.waktu_makan.includes("Sarapan");
                });
    
                // Cari menu "siang"
                let availableLunchMenus = availableMenus.filter(menu => {
                    return !menu.waktu_makan.includes("Malam");
                });
    
                if (availableLunchMenus.length > 0) {
                    // Pilih secara acak dari menu "siang" yang tersedia
                    lunchMenu = availableLunchMenus[Math.floor(Math.random() * availableLunchMenus.length)];
                }
    
                // Cari menu "malam"
                let availableDinnerMenus = availableMenus.filter(menu => {
                    return !menu.waktu_makan.includes("Siang");
                });
    
                if (availableDinnerMenus.length > 0) {
                    // Pilih secara acak dari menu "malam" yang tersedia
                    dinnerMenu = availableDinnerMenus[Math.floor(Math.random() * availableDinnerMenus.length)];
                }
    
                // Tambahkan menu-menu untuk hari ini ke daftar menu terpilih
                selectedMenus.push({
                    day: day,
                    menus: [breakfastMenu, lunchMenu, dinnerMenu].filter(menu => menu) // Filter menu yang kosong (tidak ada)
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