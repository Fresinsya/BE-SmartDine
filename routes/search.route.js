const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu, generateAllDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');
const History_makan = require('../models/History_makan');
const User = require('../models/User');
const generateDailyMenuDay = require('./generateMenu');
const RandomMenuModel = require('../models/RandomMenu');


// Definisikan route untuk menjalankan fungsi utama
// route.post('/generate', async (req, res) => {
//     try {
//         let search = req.query.search || [];
//         // const { kalori } = req.body;
//         const { IdUser } = req.body;

//         const user = await User.findById(IdUser);
//         if (!user) {
//             res.status(404).json({ message: 'User tidak ditemukan' });
//             return;
//         }

//         const kalori = user.kaloriHarian;

//         console.log("kalori:", kalori);

//         // Lakukan pencarian menu
//         const searchResult = await searchMenu(search);

//         if (!searchResult || searchResult.length === 0) {
//             console.log("Menu tidak ditemukan.");
//             res.status(404).json({ message: 'Menu tidak ditemukan' });
//             return;
//         }

//         // Generate menu harian dari hasil pencarian
//         const dailyMenus = await generateDailyMenu(searchResult, kalori);

//         let date_selesai = new Date(); // Nilai default, Anda dapat mengganti ini sesuai kebutuhan
//         date_selesai.setDate(date_selesai.getDate() + 6); // Tambahkan 6 hari

//         // Jika bulan selesai berbeda dengan bulan tanggal makan
//         if (date_selesai.getMonth() !== date_selesai.getMonth()) {
//             // Hitung sisa hari dalam bulan tanggal makan
//             const sisaHari = new Date(date_selesai.getFullYear(), date_selesai.getMonth() + 1, 0).getDate() - date_selesai.getDate();
//             // Tambahkan sisa hari ke tanggal selesai
//             date_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
//         }

//         // Simpan tanggal selesai ke dalam objek req.body
//         req.body.date_selesai = date_selesai;

//         // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
//         const randomMenus = dailyMenus.map((menus, day) => ({
//             IdUser: req.body.IdUser, // Mengambil IdUser dari req.body
//             day: day + 1,
//             Date: new Date(),
//             Date_selesai: date_selesai,
//             menus: menus.map(menu => ({
//                 id_menu: menu._id,
//                 menu: menu.menu,
//                 bahan: menu.bahan,
//                 cara_masak: menu.cara_masak,
//                 kalori_makanan: menu.kalori_makanan,
//                 waktu_makan: menu.waktu_makan,
//                 avatar: menu.avatar,
//                 jenis_bahan: menu.jenis_bahan,
//                 berat_makanan: menu.berat_makanan,
//                 day: day + 1 // Menambahkan properti day di dalam objek menu
//             }))
//         }));

//         const HistoryMakan = dailyMenus.map((menus, day) => ({
//             tgl_mulai: new Date(),
//             tgl_selesai: date_selesai,
//             id_user: req.body.IdUser,
//             menus: menus.map(menu => ({
//                 day: day + 1,
//                 id_menu: menu._id,
//                 menu: menu.menu,
//             }))
//         }));


//         // Simpan data ke dalam skema RandomMenu
//         // await RandomMenu.create(randomMenus);
//         // await History_makan.create(HistoryMakan);

//         console.log("Random menus generated successfully");
//         res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
//     } catch (error) {
//         console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });



route.post('/generate', async (req, res) => {
    try {
        const { IdUser } = req.body;
        let search = req.query.search || [];

        const user = await User.findById(IdUser);
        if (!user) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }

        const kalori = user.kaloriHarian;
        // const kaloriperMakan = kalori / 3;

        console.log("kalori per makan:", kalori);

        // Lakukan pencarian menu untuk setiap jenis bahan makanan
        const searchResult = await searchMenu(search);

        // console.log(searchResult)

        // Hitung total kalori makanan dari setiap jenis bahan makanan
        const totalKalori = Object.values(searchResult).reduce((total, menuArr) => {
            menuArr.forEach(menu => {
                total += menu.kalori_makanan;
            });
            return total;
        }, 0);

        console.log("Total kalori makanan:", totalKalori);

        // Lanjutkan proses seperti yang diimplementasikan sebelumnya
        const pokokSearchResult = searchResult.pokokMenus;
        const laukSearchResult = searchResult.laukMenus;
        const sayuranSearchResult = searchResult.sayuranMenus;
        const buahSearchResult = searchResult.buahMenus;

       
        // Gabungkan hasil pencarian dari setiap jenis bahan makanan menjadi satu objek
        const combinedSearchResult = {
            pokok: pokokSearchResult,
            lauk: laukSearchResult,
            sayuran: sayuranSearchResult,
            buah: buahSearchResult
        };

        const generateCoba = await generateDailyMenu(combinedSearchResult, kalori);

        let date_selesai = new Date(); // Nilai default, Anda dapat mengganti ini sesuai kebutuhan
        date_selesai.setDate(date_selesai.getDate() + 6); // Tambahkan 6 hari

        // Jika bulan selesai berbeda dengan bulan tanggal makan
        if (date_selesai.getMonth() !== date_selesai.getMonth()) {
            // Hitung sisa hari dalam bulan tanggal makan
            const sisaHari = new Date(date_selesai.getFullYear(), date_selesai.getMonth() + 1, 0).getDate() - date_selesai.getDate();
            // Tambahkan sisa hari ke tanggal selesai
            date_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
        }

        // Simpan tanggal selesai ke dalam objek req.body
        req.body.date_selesai = date_selesai;


        const randomMenus = generateCoba.map((menus, day) => {
            const Date_selesai = date_selesai; // Pastikan date_selesai telah didefinisikan sebelumnya
            const IdUser = req.body.IdUser; // Pastikan req.body.IdUser telah didefinisikan sebelumnya

            const mappedMenus = menus.map(item => {
                const pokokAvatar = item.pokok.avatar;
                const laukAvatar = item.lauk.avatar;
                const sayurAvatar = item.sayuran.avatar;

                const pokokNama = item.pokok.menu;
                const laukNama = item.lauk.menu;
                const sayurNama = item.sayuran.menu;

                const pokokIds = item.pokok._id;
                const laukIds = item.lauk._id;
                const sayurIds = item.sayuran._id;

                const pokokBeratBaru = item.pokokBeratModif;
                const laukBeratBaru = item.laukBeratModif;
                const sayurBeratBaru = item.sayuranBeratModif;

                const pokokKaloriBaru = item.pokokKaloriModif;
                const laukKaloriBaru = item.laukKaloriModif;
                const sayurKaloriBaru = item.sayuranKaloriModif;

                const hasil = [
                    { id_menu: pokokIds, menu: pokokNama, avatar: pokokAvatar, day: day + 1, kalori_modif: pokokKaloriBaru, berat_modif: pokokBeratBaru, jenis: "pokok" },
                    { id_menu: laukIds, menu: laukNama, avatar: laukAvatar, day: day + 1, kalori_modif: laukKaloriBaru, berat_modif: laukBeratBaru, jenis: "lauk" },
                    { id_menu: sayurIds, menu: sayurNama, avatar: sayurAvatar, day: day + 1, kalori_modif: sayurKaloriBaru, berat_modif: sayurBeratBaru, jenis: "sayuran" }
                ];

                return hasil;
            });

            return {
                IdUser: IdUser,
                day: day + 1,
                Date: new Date(),
                Date_selesai: Date_selesai,
                menus: mappedMenus.flat() // Menggunakan flat() untuk "membentangkan" array hasil map
            };
        });


        const HistoryMakan = generateCoba.map((menus, day) => {
            // Memeriksa apakah semua properti yang dibutuhkan tersedia di objek data
            // const tgl_mulai: new Date();
            const tgl_selesai = date_selesai;
            const id_user = req.body.IdUser;
            const mappedMenus = menus.map(item => {
                const pokokAvatar = item.pokok.avatar;
                const laukAvatar = item.lauk.avatar;
                const sayurAvatar = item.sayuran.avatar;

                const pokokNama = item.pokok.menu;
                const laukNama = item.lauk.menu;
                const sayurNama = item.sayuran.menu;

                const pokokIds = item.pokok._id;
                const laukIds = item.lauk._id;
                const sayurIds = item.sayuran._id;

                const pokokBeratBaru = item.pokokBeratModif;
                const laukBeratBaru = item.laukBeratModif;
                const sayurBeratBaru = item.sayuranBeratModif;

                const pokokKaloriBaru = item.pokokKaloriModif;
                const laukKaloriBaru = item.laukKaloriModif;
                const sayurKaloriBaru = item.sayuranKaloriModif;

                const hasil = [
                    { id_menu: pokokIds, menu: pokokNama, day: day + 1, kalori_modif: pokokKaloriBaru, berat_modif: pokokBeratBaru },
                    { id_menu: laukIds, menu: laukNama, day: day + 1, kalori_modif: laukKaloriBaru, berat_modif: laukBeratBaru },
                    { id_menu: sayurIds, menu: sayurNama, day: day + 1, kalori_modif: sayurKaloriBaru, berat_modif: sayurBeratBaru }
                ];

                return hasil;
            });

            return {
                id_user: id_user,
                day: day + 1,
                Date: new Date(),
                Date_selesai: tgl_selesai,
                menus: mappedMenus.flat() // Menggunakan flat() untuk "membentangkan" array hasil map
            };

        });


        // Simpan data ke dalam skema RandomMenu dan History_makan
        await RandomMenuModel.create(randomMenus);
        await History_makan.create(HistoryMakan);

        console.log("Random menus generated successfully", generateCoba);
        res.status(200).json({ message: 'Random menus generated successfully', data: HistoryMakan });
    } catch (error) {
        console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
        res.status(500).json({ error: error.message });
    }
});





// random semua bahan
route.post('/all', async (req, res) => {
    try {

        // Lakukan pencarian semua menu
        const allMenus = await Menu.find();

        if (!allMenus || allMenus.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Ambil semua bahan dari semua menu
        const allIngredients = allMenus.flatMap(menu => menu.bahan.map(bahan => bahan.nama)).join(', ');

        const searchResult = await searchMenu(allIngredients);
        console.log(allIngredients);

        if (!searchResult || searchResult.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Generate menu harian
        const dailyMenus = await generateAllDailyMenu(searchResult);


        let date_selesai = new Date(); // Nilai default, Anda dapat mengganti ini sesuai kebutuhan
        date_selesai.setDate(date_selesai.getDate() + 6); // Tambahkan 6 hari

        // Jika bulan selesai berbeda dengan bulan tanggal makan
        if (date_selesai.getMonth() !== date_selesai.getMonth()) {
            // Hitung sisa hari dalam bulan tanggal makan
            const sisaHari = new Date(date_selesai.getFullYear(), date_selesai.getMonth() + 1, 0).getDate() - date_selesai.getDate();
            // Tambahkan sisa hari ke tanggal selesai
            date_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
        }

        // Simpan tanggal selesai ke dalam objek req.body
        req.body.date_selesai = date_selesai;

        // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
        const randomMenus = dailyMenus.map((menus, day) => ({
            IdUser: req.body.IdUser, // Mengambil IdUser dari req.body
            day: day + 1,
            Date: new Date(),
            Date_selesai: date_selesai,
            menus: menus.map(menu => ({
                id_menu: menu._id,
                menu: menu.menu,
                bahan: menu.bahan,
                cara_masak: menu.cara_masak,
                kalori_makanan: menu.kalori_makanan,
                waktu_makan: menu.waktu_makanan,
                avatar: menu.avatar,
                jenis_bahan: menu.jenis_bahan,
                berat_makanan: menu.berat_makanan,
                day: day + 1 // Menambahkan properti day di dalam objek menu
            }))
        }));

        const HistoryMakan = dailyMenus.map((menus, day) => ({
            tgl_mulai: req.body.date_mulai,
            tgl_selesai: date_selesai,
            id_user: req.body.IdUser,
            menus: menus.map(menu => ({
                day: day + 1,
                id_menu: menu._id,
                menu: menu.menu,
            }))
        }));

        // Simpan data ke dalam skema RandomMenu dan History_makan
        // await RandomMenu.create(randomMenus);
        // await History_makan.create(HistoryMakan);

        console.log(dailyMenus[0])
        console.log("Random menus generated successfully");
        res.status(200).json({ message: 'Random menus all bahan successfully', data: randomMenus });
    } catch (error) {
        console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    searchMenuRoute: route,
}