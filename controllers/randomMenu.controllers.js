const History_makan = require("../models/History_makan");
const Menu = require("../models/Menu");
const RandomMenu = require("../models/RandomMenu");
const { searchMenu, generateDailyMenu } = require("./search.controllers");

module.exports = {
    // generateRandomMenu: async (req, res) => {
    //     const { dailyCalories, IdUser } = req.body;
    //     const days = 6;
    //     const menusForThisDay = 3;
    //     const selectedMenus = [];

    //     try {
    //         // Ambil semua menu
    //         const allMenus = await Menu.find();

    //         // Buat fungsi untuk memilih menu secara acak
    //         const getRandomMenu = () => {
    //             const randomIndex = Math.floor(Math.random() * allMenus.length);
    //             return allMenus[randomIndex];
    //         };

    //         // Lakukan iterasi untuk memilih menu untuk setiap hari
    //         for (let day = 1; day <= days; day++) {
    //             let breakfastMenu = getRandomMenu();
    //             // Pastikan menu sarapan terpilih memiliki waktu_makan "Sarapan"
    //             while (!breakfastMenu.waktu_makan.includes("Sarapan")) {
    //                 breakfastMenu = getRandomMenu();
    //             }

    //             let lunchMenu;
    //             let dinnerMenu;

    //             // Pilih menu "siang" dan "malam" sesuai aturan yang ditentukan
    //             const availableMenus = allMenus.filter(menu => {
    //                 return !menu.waktu_makan.includes("Sarapan");
    //             });

    //             // Cari menu "siang"
    //             let availableLunchMenus = availableMenus.filter(menu => {
    //                 return !menu.waktu_makan.includes("Malam");
    //             });

    //             if (availableLunchMenus.length > 0) {
    //                 // Pilih secara acak dari menu "siang" yang tersedia
    //                 lunchMenu = availableLunchMenus[Math.floor(Math.random() * availableLunchMenus.length)];
    //             }

    //             // Cari menu "malam"
    //             let availableDinnerMenus = availableMenus.filter(menu => {
    //                 return !menu.waktu_makan.includes("Siang");
    //             });

    //             if (availableDinnerMenus.length > 0) {
    //                 // Pilih secara acak dari menu "malam" yang tersedia
    //                 dinnerMenu = availableDinnerMenus[Math.floor(Math.random() * availableDinnerMenus.length)];
    //             }

    //             // Tambahkan menu-menu untuk hari ini ke daftar menu terpilih
    //             selectedMenus.push({
    //                 day: day,
    //                 menus: [breakfastMenu, lunchMenu, dinnerMenu].filter(menu => menu) // Filter menu yang kosong (tidak ada)
    //             });
    //         }

    //         // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
    //         const randomMenus = selectedMenus.map(menu => ({
    //             IdUser: IdUser,
    //             day: menu.day,
    //             menus: menu.menus
    //         }));

    //         await RandomMenu.create(randomMenus);

    //         return res.status(200).json({
    //             status: 'Success',
    //             message: 'Random menus generated successfully',
    //             data: selectedMenus
    //         });
    //     } catch (error) {
    //         return res.status(500).json({ status: 'Error', message: error.message });
    //     }
    // }

    getAllRandomMenu: async (req, res) => {
        try {
            const randomMenus = await RandomMenu.find();
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: randomMenus,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    editRandomMenuByIdUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deleteMenu = await RandomMenu.deleteMany({ IdUser: id });
            // randommenu
            let search = req.query.search || [];

            // Lakukan pencarian menu
            const searchResult = await searchMenu(search);

            if (!searchResult || searchResult.length === 0) {
                console.log("Menu tidak ditemukan.");
                res.status(404).json({ message: 'Menu tidak ditemukan' });
                return;
            }

            // Generate menu harian dari hasil pencarian
            const dailyMenus = await generateDailyMenu(searchResult);

            // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
            const randomMenus = dailyMenus.map((menus, day) => ({
                IdUser: id, // Mengambil IdUser dari req.body
                day: day + 1, // Menambahkan properti day
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

            

            // Simpan data ke dalam skema RandomMenu
            await RandomMenu.create(randomMenus);


            console.log("Random menus generated successfully");
            res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mendapatkan data",
                error: error.message,
            });
        }
        // try {
        //     let search = req.query.search || [];

        //     // Lakukan pencarian menu
        //     const searchResult = await searchMenu(search);

        //     if (!searchResult || searchResult.length === 0) {
        //         console.log("Menu tidak ditemukan.");
        //         res.status(404).json({ message: 'Menu tidak ditemukan' });
        //         return;
        //     }

        //     // Generate menu harian dari hasil pencarian
        //     const dailyMenus = await generateDailyMenu(searchResult);

        //     // Simpan menu-menu yang dipilih ke dalam skema RandomMenu
        //     const randomMenus = dailyMenus.map((menus, day) => ({
        //         IdUser: req.body.IdUser, // Mengambil IdUser dari req.body
        //         day: day + 1, // Menambahkan properti day
        //         menus: menus.map(menu => ({
        //             id_menu: menu._id,
        //             menu: menu.menu,
        //             bahan: menu.bahan,
        //             cara_masak: menu.cara_masak,
        //             kalori_makanan: menu.kalori_makanan,
        //             waktu_makan: menu.waktu_makan,
        //             avatar: menu.avatar,
        //             jenis_bahan: menu.jenis_bahan,
        //             berat_makanan: menu.berat_makanan,
        //             day: day + 1 // Menambahkan properti day di dalam objek menu
        //         }))
        //     }));

        //     // Simpan data ke dalam skema RandomMenu
        //     await RandomMenu.create(randomMenus);

        //     console.log("Random menus generated successfully");
        //     res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
        // } catch (error) {
        //     console.error("Gagal melakukan pencarian atau pembuatan menu:", error.message);
        //     res.status(500).json({ error: error.message });
        // }
    },
    getRandomById: async (req, res) => {
        const id = req.params.id;
        try {
            const randomMenu = await RandomMenu.find(
                { IdUser: id }
            );
            if (!randomMenu) {
                return res.status(404).json({
                    status: "Error",
                    message: "Data tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "Success",
                message: "Data ditemukan",
                data: randomMenu,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    deleteFullMenu: async (req, res) => {
        try {
            const result = await RandomMenu.deleteMany();
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    status: "Error",
                    message: "Data tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "Success",
                message: "Data berhasil dihapus",
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal menghapus data",
                error: error.message,
            });
        }
    },
    deleteRandomMenuById: async (req, res) => {
        const idUser = req.params.id; // Mengambil IdUser dari parameter URL
        try {
            // Menghapus data berdasarkan IdUser
            const result = await RandomMenu.deleteMany({ IdUser: idUser });

            // Memeriksa apakah data berhasil dihapus
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    status: "Error",
                    message: "Data tidak ditemukan",
                });
            }

            // Menanggapi dengan status sukses jika data berhasil dihapus
            res.status(200).json({
                status: "Success",
                message: "Data berhasil dihapus",
            });
        } catch (error) {
            // Menanggapi dengan status error jika terjadi kesalahan
            res.status(500).json({
                status: "Error",
                message: "Gagal menghapus data",
                error: error.message,
            });
        }
    },
}