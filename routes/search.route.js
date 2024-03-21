const express = require('express');
const route = express.Router();

// Import model, fungsi searchMenu, dan generateDailyMenu
const Menu = require('../models/Menu');
const { searchMenu, generateDailyMenu, generateAllDailyMenu } = require('../controllers/search.controllers');
const RandomMenu = require('../models/RandomMenu');
const History_makan = require('../models/History_makan');


// Definisikan route untuk menjalankan fungsi utama
route.post('/generate', async (req, res) => {
    try {
        let search = req.query.search || [];
        const { kalori } = req.body;

        // Lakukan pencarian menu
        const searchResult = await searchMenu(search);

        if (!searchResult || searchResult.length === 0) {
            console.log("Menu tidak ditemukan.");
            res.status(404).json({ message: 'Menu tidak ditemukan' });
            return;
        }

        // Generate menu harian dari hasil pencarian
        const dailyMenus = await generateDailyMenu(searchResult, kalori);

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
                waktu_makan: menu.waktu_makan,
                avatar: menu.avatar,
                jenis_bahan: menu.jenis_bahan,
                berat_makanan: menu.berat_makanan,
                day: day + 1 // Menambahkan properti day di dalam objek menu
            }))
        }));

        const HistoryMakan = dailyMenus.map((menus, day) => ({
            tgl_mulai: new Date(),
            tgl_selesai: date_selesai,
            id_user: req.body.IdUser,
            menus: menus.map(menu => ({
                day: day + 1,
                id_menu: menu._id,
                menu: menu.menu,
            }))
        }));

        // Simpan data ke dalam skema RandomMenu
        await RandomMenu.create(randomMenus);
        await History_makan.create(HistoryMakan);

        console.log("Random menus generated successfully");
        res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
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