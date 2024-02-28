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
        const menuPerDay = 3;
        const dailyMenus = [];

        // Bagi hasil pencarian menjadi 6 bagian, mewakili 6 hari
        for (let day = 0; day < totalDays; day++) {
            const dailyMenu = [];
            let hasBreakfast = false; // Untuk melacak apakah menu sarapan sudah dipilih

            // Ambil menu untuk setiap waktu makan
            for (let i = 0; i < menuPerDay; i++) {
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

            dailyMenus.push(dailyMenu);
        }

        // Konversi format menu untuk setiap hari sesuai dengan yang diminta
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

        randomMenus.push(randomMenus);

        // Simpan data ke dalam skema RandomMenu
        // await RandomMenu.create(randomMenus);

        return randomMenus;

        console.log("Random menus generated successfully");
    } catch (error) {
        throw new Error(error.message);
    }
}



module.exports = {
    searchMenu,
    generateDailyMenu
}

