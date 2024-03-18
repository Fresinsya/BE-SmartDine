// Import model dan fungsi pencarian
const Menu = require('../models/Menu');
const RandomMenu = require('../models/RandomMenu');

// Function untuk mencari menu berdasarkan kriteria pencarian
async function searchMenu(search) {
    try {

        const keywords = search.includes(",") ? search.split(",") : [search];

        // const jenisBahanOptions = ["Sayuran", "Buah", "Makanan pokok", "Lauk pauk"];

        // if (!jenisBahan) {
        //     jenisBahan = jenisBahanOptions;
        // } else {
        //     jenisBahan = jenisBahan.split(",");
        // }

        const menus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
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
        const totalDays = 7;
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
const generateAllDailyMenu = async (shuffledIngredients) => {
    try {
        const totalDays = 7;
        const menuPerDay = 3;
        const dailyMenus = [];

        for (let day = 0; day < totalDays; day++) {
            const dailyMenu = [];

            for (let i = 0; i < menuPerDay; i++) {
                const menuIndex = Math.floor(Math.random() * shuffledIngredients.length);
                dailyMenu.push(shuffledIngredients[menuIndex]);
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
    generateDailyMenu,
    generateAllDailyMenu
}

