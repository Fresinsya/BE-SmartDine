// Import model dan fungsi pencarian
const Menu = require('../models/Menu');

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
        const menusPerDay = 3;
        const selectedMenus = [];

        // Lakukan iterasi untuk setiap hari
        for (let day = 1; day <= totalDays; day++) {
            const dailyMenu = [];

            let hasBreakfast = false; // Untuk melacak apakah menu sarapan sudah dipilih

            // Ambil menu untuk setiap waktu makan
            for (let i = 0; i < menusPerDay; i++) {
                let randomMenu;

                // Pastikan setidaknya satu menu memiliki waktu_makan = 'Sarapan'
                if (!hasBreakfast) {
                    randomMenu = searchResult.find(menu => menu.waktu_makan.includes('Sarapan'));
                    if (randomMenu) {
                        hasBreakfast = true;
                    }
                }

                // Jika belum ada menu sarapan terpilih, pilih secara acak dari hasil pencarian
                if (!randomMenu) {
                    const randomIndex = Math.floor(Math.random() * searchResult.length);
                    randomMenu = searchResult[randomIndex];
                }

                dailyMenu.push(randomMenu);
            }

            selectedMenus.push(dailyMenu);
        }

        return selectedMenus;
    } catch (error) {
        throw new Error(error.message);
    }
}



module.exports = {
    searchMenu,
    generateDailyMenu
}

