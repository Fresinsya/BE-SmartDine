// Import model dan fungsi pencarian
const Menu = require('../models/Menu');

// Function untuk mencari menu berdasarkan kriteria pencarian
async function searchMenu(search, jenisBahan) {
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
// async function generateDailyMenu(searchResult) {
//     try {
//         const totalDays = 6;
//         const menuPerDay = 3;
//         const dailyMenus = [];

//         // Bagi hasil pencarian menjadi 6 bagian, mewakili 6 hari
//         for (let day = 0; day < totalDays; day++) {
//             const dailyMenu = [];

//             // Ambil 3 menu untuk setiap hari
//             for (let i = 0; i < menuPerDay; i++) {
//                 const menuIndex = (day * menuPerDay + i) % searchResult.length;
//                 dailyMenu.push(searchResult[menuIndex]);
//             }

//             dailyMenus.push(dailyMenu);
//         }

//         return dailyMenus;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

async function generateDailyMenu(searchResult) {
    try {
        const totalDays = 6;
        const menusPerDay = {
            sarapan: 1,
            siang: 1,
            malam: 1,
        };
        const dailyMenus = [];

        // Bagi hasil pencarian menjadi 6 bagian, mewakili 6 hari
        for (let day = 0; day < totalDays; day++) {
            const dailyMenu = [];

            // Ambil menu untuk setiap waktu makan
            for (const waktuMakan in menusPerDay) {
                const menu = searchResult.find(menu => menu.waktu_makan.includes(waktuMakan));
                if (menu) {
                    dailyMenu[waktuMakan] = menu;
                } else {
                    // Jika tidak ada menu untuk waktu makan ini, bisa diisi dengan nilai default
                    dailyMenu[waktuMakan] = { menu: "Menu Default", waktu_makan: waktuMakan };
                }
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

