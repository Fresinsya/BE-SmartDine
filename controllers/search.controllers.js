// Import model dan fungsi pencarian
const Menu = require('../models/Menu');

// Function untuk mencari menu berdasarkan kriteria pencarian
async function searchMenu(search, jenisBahan) {
    try {
        
        const keywords = search.includes(",") ? search.split(",") : [search];
        
    
            // const jenisBahanOptions = ["sayuran", "buah", "pokok", "lauk", "bumbu", "lainnya"];
    
            // // Jika jenisBahan tidak diinputkan, tampilkan semua jenis bahan
            // if (!jenisBahan) {
            //     jenisBahan = jenisBahanOptions;
            // } 
            // else {
            //     if (jenisBahan.includes(",")) {
            //         jenisBahan = jenisBahan.split(",");
            //     }
            // }
    
            // // Lakukan pencarian menu berdasarkan jenis bahan
            // const menus = await Menu.find({
            //     'bahan.jenis': { $in: jenisBahan } // Menggunakan $in untuk mencocokkan dengan nilai array jenisBahan
            // });
    
            // Pengecekan apakah ada hasil pencarian
            if (!menus || menus.length === 0) {
                return res.status(404).json({
                    status: "Error",
                    message: "Menu tidak ditemukan."
                });
            }

        const menus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) }
            // $or: [
            //     { jenis_bahan: { $in: jenisBahan.map(option => new RegExp(option, 'i')) } },
            //     { jenis_bahan: { $exists: false } },
            //     { jenis_bahan: { $size: 0 } }
            // ]
        });
        return menus;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Function untuk membuat menu harian dari hasil pencarian
async function generateDailyMenu(searchResult) {
    try {
        const totalDays = 6;
        const menuPerDay = 3;
        const dailyMenus = [];

        // Bagi hasil pencarian menjadi 6 bagian, mewakili 6 hari
        for (let day = 0; day < totalDays; day++) {
            const dailyMenu = [];

            // Ambil 3 menu untuk setiap hari
            for (let i = 0; i < menuPerDay; i++) {
                const menuIndex = (day * menuPerDay + i) % searchResult.length;
                dailyMenu.push(searchResult[menuIndex]);
            }

            dailyMenus.push(dailyMenu);
        }

        return dailyMenus;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    searchMenu,
    generateDailyMenu
}

