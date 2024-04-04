// Import model dan fungsi pencarian
const Menu = require('../models/Menu');
const RandomMenu = require('../models/RandomMenu');
const generateDailyMenuDay = require('../routes/generateMenu');

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

        const laukMenus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
            "bahan.jenis": "lauk"
        });

        const sayuranMenus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
            "bahan.jenis": "sayuran"
        });

        const pokokMenus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
            "bahan.jenis": "pokok"
        });
        const buahMenus = await Menu.find({
            "bahan.nama": { $in: keywords.map(keyword => new RegExp(keyword, 'i')) },
            "bahan.jenis": "buah"
        });

        // console.log(buahMenus)

        return {
            laukMenus,
            sayuranMenus,
            pokokMenus,
            buahMenus
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Function untuk membuat menu harian dari hasil pencarian
// async function generateDailyMenu(searchResult, totalCalories) {
//     try {
//         const totalDays = 1;
//         const menuPerDay = 1;
//         const dailyMenus = [];

//         if (!searchResult || searchResult.length === 0) {
//             throw new Error("Search result is empty or undefined");
//         }

//         for (let day = 0; day < totalDays; day++) {
//             const dailyMenu = [];
//             let totalDailyCalories = 0;

//             // Ambil menu untuk setiap hari
//             for (let i = 0; i < menuPerDay; i++) {
//                 const menuIndex = (day * menuPerDay + i) % searchResult.length;
//                 const menu = searchResult[menuIndex];

//                 if (!menu || !menu.kalori_makanan) {
//                     throw new Error("Menu or its calorie is undefined", menu);
//                 }

//                 // Tambahkan kalori menu ke total kalori harian
//                 totalDailyCalories += menu.kalori_makanan;

//                 // Tambahkan menu ke daftar menu harian
//                 dailyMenu.push(menu);
//             }

//             // Periksa apakah total kalori harian kurang dari total kalori yang diinginkan
//             if (totalDailyCalories < totalCalories) {
//                 // Jika kurang, ulangi pengambilan menu dari awal
//                 day--;
//             } else {
//                 // Jika sudah mencukupi, hentikan pengambilan menu
//                 break;
//             }
//         }

//         return dailyMenus;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// async function generateDailyMenu(menus, targetCalories) {
//     let generatedMenu = [];
//     let totalCalories = 0;

//     // Membuat array kosong untuk menyimpan menu untuk masing-masing waktu makan (sarapan, makan siang, makan malam)
//     let breakfastMenu = [];
//     let lunchMenu = [];
//     let dinnerMenu = [];

//     // Membagi menu menjadi tiga kategori waktu makan
//     for (let menu of menus) {
//         totalCalories += menu.kalori_makanan;
//         if (totalCalories <= targetCalories) {
//             if (breakfastMenu.length < 3) {
//                 breakfastMenu.push(menu);
//             } else if (lunchMenu.length < 3) {
//                 lunchMenu.push(menu);
//             } else if (dinnerMenu.length < 3) {
//                 dinnerMenu.push(menu);
//             }
//         } else {
//             totalCalories -= menu.kalori_makanan;
//         }
//     }

//     // Jika total kalori kurang dari target, duplikat menu yang sudah ada
//     while (totalCalories < targetCalories) {
//         for (let menuList of [breakfastMenu, lunchMenu, dinnerMenu]) {
//             if (totalCalories >= targetCalories) {
//                 break;
//             }
//             for (let menu of menuList) {
//                 if (totalCalories >= targetCalories) {
//                     break;
//                 }
//                 let menuCopy = Object.assign({}, menu);
//                 menuList.push(menuCopy);
//                 totalCalories += menuCopy.kalori_makanan;
//             }
//         }
//     }

//     // Menggabungkan menu untuk masing-masing waktu makan menjadi satu array utama
//     generatedMenu = generatedMenu.concat(breakfastMenu, lunchMenu, dinnerMenu);

//     return generatedMenu;
// }

// async function generateDailyMenu(searchResult, totalCalories) {
//     try {
//         const totalDays = 1;
//         const menuPerDay = 1;
//         const dailyMenus = [];

//         for (let day = 0; day < totalDays; day++) {
//             const dailyMenu = [];
//             let totalDailyCalories = 0;

//             // Ambil 3 menu untuk setiap hari
//             for (let i = 0; i < menuPerDay; i++) {
//                 const menuIndex = (day * menuPerDay + i) % searchResult.length;
//                 const menu = searchResult[menuIndex];

//                 console.log({panjng:searchResult.length, searchResult})
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

// function generateDailyMenu(searchResult, totalCalories) {
//     try {
//         let totalDays = 1;
//         let dailyMenus = [];
//         console.log({
//             targetCalori: totalCalories,
//         });

//         // Loop through each day
//         for (let day = 1; day <= totalDays; day++) {
//             let dailyMenu = [];
//             let remainingCalories = totalCalories; // Each day has totalCalories
//             let usedMenuIds = [];

//             // Retrieve menu options based on remaining calories
//             for (let i = 0; i < 3; i++) {
//                 let selectedMenu = null;

//                 // Loop through menu data to find menu options within the calorie range
//                 for (let menu of searchResult) {
//                     if (
//                         menu.kalori_makanan <= remainingCalories &&
//                         !usedMenuIds.includes(menu._id)
//                     ) {
//                         selectedMenu = menu;
//                         usedMenuIds.push(menu._id);
//                         // Add menu ID to usedMenuIds array to avoid duplication per day
//                         break;
//                     }
//                 }

//                 // Add selected menu to daily menu
//                 if (selectedMenu) {
//                     selectedMenu.tambahanGram = Math.ceil(totalCalories / selectedMenu.kalori_makanan);
//                     remainingCalories -= selectedMenu.kalori_makanan;

//                     console.log({
//                         menuAsli: `${selectedMenu.menu} - ${selectedMenu.berat_makanan} Gram - ${selectedMenu.kalori_makanan} calories`,
//                         menuModif: `${selectedMenu.menu} - ${selectedMenu.tambahanGram * parseInt(selectedMenu.berat_makanan)} Gram - ${selectedMenu.kalori_makanan * selectedMenu.tambahanGram} calories`
//                     });

//                     dailyMenu.push(selectedMenu);
//                 }
//             }

//             // Add daily menu to array
//             dailyMenus.push(dailyMenu);
//         }

//         return dailyMenus;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }


async function generateDailyMenu (searchResult, totalCalories) {
    try {
        let totalDays = 7;
        let dailyMenus = [];


        // Loop through each day
        for (let day = 1; day <= totalDays; day++) {
            let dailyMenuSet = [];

            for (let i = 0; i < 3; i++) {
                let dailyMenu = await generateDailyMenuDay(searchResult, totalCalories);
                // console.log("generateDailyMenuDay",dailyMenu);
                // console.log("searchResult",searchResult);

                // return dailyMenu;

                // Object.keys(dailyMenu).forEach(category => {
                //     console.log(`Category: ${category}`);
                //     console.log(`Makanan: ${dailyMenu[category].menu}`);
                //     console.log(`Kalori Modif: ${dailyMenu[category].kalori_modif}`);
                //     console.log(`Berat Modif: ${dailyMenu[category].berat_modif}`);
                //     console.log("\n");
                // });


                // return dailyMenu;

                dailyMenuSet.push(dailyMenu);
            }
            dailyMenus.push(dailyMenuSet);
        }

        return dailyMenus;
    } catch (error) {
        throw new Error(error.message);
    }
}



// async function generateDailyMenu(searchResult, totalCalories) {
//     try {
//         const totalDays = 7;
//         const dailyMenus = [];

//         // Membagi total kalori menjadi 3 paket
//         const caloriesPerPackage = totalCalories / 3;

//         console.log("Calories per package:", caloriesPerPackage)

//         // Loop untuk setiap hari
//         for (let day = 0; day < totalDays; day++) {
//             const packageMenus = [];

//             // Ambil satu menu untuk setiap jenis bahan makanan
//             // const pokokMenu = searchResult.pokok.find(menu => menu.kalori_makanan <= caloriesPerPackage);
//             // const laukMenu = searchResult.lauk.find(menu => menu.kalori_makanan <= caloriesPerPackage);
//             // const sayuranMenu = searchResult.sayuran.find(menu => menu.kalori_makanan <= caloriesPerPackage);

//             // Pastikan menu-menu ditemukan
//             if (pokokMenu && laukMenu && sayuranMenu) {
//                 packageMenus.push(pokokMenu, laukMenu, sayuranMenu);
//             }

//             // Tambahkan paket makanan untuk hari ini ke dalam daftar menu harian
//             dailyMenus.push(packageMenus);
//         }

//         return dailyMenus;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }










module.exports = {
    searchMenu,
    generateDailyMenu
}

