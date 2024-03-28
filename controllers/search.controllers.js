// Import model dan fungsi pencarian
const Menu = require('../models/Menu');
const RandomMenu = require('../models/RandomMenu');

// Function untuk mencari menu berdasarkan kriteria pencarian
// async function searchMenu(search) {
//     try {

//         const keywords = search.includes(",") ? search.split(",") : [search];

//         // const jenisBahanOptions = ["Sayuran", "Buah", "Makanan pokok", "Lauk pauk"];

//         // if (!jenisBahan) {
//         //     jenisBahan = jenisBahanOptions;
//         // } else {
//         //     jenisBahan = jenisBahan.split(",");
//         // }

//         const menus = await Menu.find({
//             "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
//             // $or: [
//             //     { jenis_bahan: { $in: jenisBahan.map(option => new RegExp(option, 'i')) } },
//             //     { jenis_bahan: { $exists: false } },
//             //     { jenis_bahan: { $size: 0 } }
//             // ]
//         });
//         return menus;
//     }
//     catch (error) {
//         throw new Error(error.message);
//     }
// }

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
// async function generateDailyMenu(searchResult, totalCalories) {
//     try {
//         const totalDays = 7;
//         const menuPerDay = 3;
//         const dailyMenus = [];

//         for (let day = 0; day < totalDays; day++) {
//             const dailyMenu = [];
//             let totalDailyCalories = 0;

//             // Ambil 3 menu untuk setiap hari
//             for (let i = 0; i < menuPerDay; i++) {
//                 const menuIndex = (day * menuPerDay + i) % searchResult.length;
//                 const menu = searchResult[menuIndex];
                
//                 // Tambahkan kalori menu ke total kalori harian
//                 totalDailyCalories += menu.kalori_makanan;

//                 // Tambahkan menu ke daftar menu harian
//                 dailyMenu.push(menu);
//             }

//             // Periksa apakah total kalori harian kurang dari total kalori yang diinginkan
//             if (totalDailyCalories < totalCalories) {
//                 dailyMenus.push(dailyMenu);
//             } else {
//                 // Jika total kalori harian lebih dari atau sama dengan total kalori yang diinginkan,
//                 // hentikan pengambilan menu dan tambahkan menu harian ke daftar menu harian
//                 dailyMenus.push(dailyMenu);
//                 break;
//             }
//         }

//         return dailyMenus;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }


async function generateDailyMenu(searchResult, totalCalories) {
    try {
        const totalDays = 7;
        const menuPerDay = 1; // Karena kita hanya ingin membuat satu menu per jenis bahan makanan
        const dailyMenus = [];

        // Membagi total kalori menjadi 3 paket
        const caloriesPerPackage = totalCalories / 3;

        // Loop untuk setiap hari
        for (let day = 0; day < totalDays; day++) {
            const packageMenus = [];

            // Loop untuk setiap paket makanan
            for (let packageIndex = 0; packageIndex < 3; packageIndex++) {
                const dailyMenu = [];
                let totalDailyCalories = 0;

                // Ambil jenis bahan makanan yang sesuai dengan indeks paket
                const jenisBahan = packageIndex === 0 ? "pokok" : packageIndex === 1 ? "lauk" : "sayuran";

                
                // Ambil menu sesuai dengan jenis bahan makanan
                const menu = searchResult.find(menu => menu.bahan.jenis === jenisBahan);

                // Pastikan menu dengan jenis bahan makanan ditemukan
                if (menu) {
                    // Tambahkan menu ke daftar menu harian
                    dailyMenu.push(menu);
                    totalDailyCalories += menu.kalori_makanan;
                }

                // Tambahkan menu harian ke dalam paket makanan
                packageMenus.push(dailyMenu);
            }

            // Tambahkan paket makanan untuk hari ini ke dalam daftar menu harian
            dailyMenus.push(packageMenus);
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

