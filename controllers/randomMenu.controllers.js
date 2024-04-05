const History_makan = require("../models/History_makan");
const Menu = require("../models/Menu");
const RandomMenuModel = require("../models/RandomMenu");
const RandomMenu = require("../models/RandomMenu");
const User = require("../models/User");
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
            // const { kalori } = req.body;
            const deleteMenu = await RandomMenu.deleteMany({ IdUser: id });
            // randommenu
            let search = req.query.search || [];

            const user = await User.findById(id);
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
                const IdUser = id; // Pastikan req.body.IdUser telah didefinisikan sebelumnya

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
                const id_user = id;
                const mappedMenus = menus.map(item => {
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
            res.status(200).json({ message: 'Random menus generated successfully', data: randomMenus });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mendapatkan data",
                error: error.message,
            });
        }
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
    getRandomBy_id: async (req, res) => {
        const id = req.params.id;
        const IdMenu = req.params.IdMenu;
        try {
            // Mencari randomMenu berdasarkan IdUser
            const randomMenu = await RandomMenu.findOne({ IdUser: id });
        
            if (!randomMenu) {
                return res.status(404).json({
                    status: "Error",
                    message: "Data tidak ditemukan",
                });
            }
        
            const foundMenu = randomMenu.menus.find(menu => menu.id_menu === IdMenu);

            if (!foundMenu) {
                return res.status(404).json({
                    status: "Error",
                    message: "Menu tidak ditemukan",
                });
            }
        
            res.status(200).json({
                status: "Success",
                message: "Data ditemukan",
                data: foundMenu
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mendapatkan data",
                error: error.message,
            });
        }
    },    
    getRandomDayAndIdUser: async (req, res) => {
        const id = req.params.id;
        const day = parseInt(req.params.day);
        const paket = parseInt(req.params.paket);
        try {
            const randomMenu = await RandomMenu.findOne(
                { 
                    IdUser: id,
                    day: day // Menambahkan kondisi untuk mencocokkan day yang terluar
                }
            );
            if (!randomMenu) {
                return res.status(404).json({
                    status: "Error",
                    message: "Data tidak ditemukan",
                });
            }

            // Menambahkan kondisi untuk memfilter paket makanan
            if (paket === 1) {
                // Mengambil index menus ke 0, 1, dan 2
                randomMenu.menus = randomMenu.menus.slice(0, 3);
            } else if (paket === 2) {
                // Mengambil index menus ke 3, 4, dan 5
                randomMenu.menus = randomMenu.menus.slice(3, 6);
            } else if (paket === 3) {
                // Mengambil index menus ke 6, 7, dan 8
                randomMenu.menus = randomMenu.menus.slice(6, 9);
            }else {
                return res.status(404).json({
                    status: "Error",
                    message: "paket tidak ditemukan",
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