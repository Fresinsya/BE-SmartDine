const cloudinary = require("cloudinary").v2;
const History_makan = require("../models/History_makan");
const Menu = require('../models/Menu');

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    getAllMenu: async (req, res) => {
        try {
            const menu = await Menu.find();
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: menu,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    getMenubyId: async (req, res) => {
        const id = req.params.id;
        try {
            const menu = await Menu.findById(id);
            if (!menu) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: menu,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    createMenu: async (req, res) => {
        const { menu, ingredients, bahan, cara_masak, kalori_makanan, berat_makanan, jenis_bahan, waktu_makan, image } = req.body;

        try {
            // const result = await cloudinary.uploader.upload(image);
            // const avatarUrl = result.secure_url;

            // if (req.file) {
            //     const result = await cloudinary.uploader.upload(req.file.path);
            //     avatarUrl = result.secure_url;
            // } else {
            //     avatarUrl = "https://i.stack.imgur.com/l60Hf.png";
            // }

            let avatarUrl = "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711198057/piring_gbndqt.jpg";

            if (req.body.avatar) {
                const result = await cloudinary.uploader.upload(req.body.avatar);
                avatarUrl = result.secure_url;
            }

            const newMenu = await Menu.create({
                menu: menu,
                bahan: bahan.map(item => ({
                    nama: item.nama,
                    jenis: item.jenis,
                    jumlah: item.jumlah
                })),
                avatar: avatarUrl,
                cara_masak: cara_masak,
                kalori_makanan: kalori_makanan,
                berat_makanan: berat_makanan
            });

            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan data menu",
                data: newMenu
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan data menu",
                error: error.message,
            });
        }
    },
    editMenu: async (req, res) => {
        try {
            const { id } = req.params;
            const existingMenu = await Menu.findById(id);
            if (!existingMenu) {
                return res.status(404).json({
                    status: "Error",
                    message: "Menu tidak ditemukan",
                });
            }

            let avatarUrl = existingMenu.avatar;

            // Periksa apakah ada avatar yang baru diunggah dalam permintaan
            if (req.body.avatar) {
                const result = await cloudinary.uploader.upload(req.body.avatar);
                avatarUrl = result.secure_url;
            }

            // Memperbarui entri menu dengan properti yang diberikan
            existingMenu.menu = req.body.menu || existingMenu.menu;
            existingMenu.bahan = req.body.bahan || existingMenu.bahan;
            existingMenu.cara_masak = req.body.cara_masak || existingMenu.cara_masak;
            existingMenu.kalori_makanan = req.body.kalori_makanan || existingMenu.kalori_makanan;
            existingMenu.berat_makanan = req.body.berat_makanan || existingMenu.berat_makanan;
            existingMenu.avatar = avatarUrl;

            // Simpan perubahan pada entri menu
            const updatedMenu = await existingMenu.save();

            res.status(200).json({
                status: "Success",
                message: "Berhasil memperbarui data menu",
                data: updatedMenu,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal memperbarui data menu",
                error: error.message,
            });
        }
    },
    deleteMenu: async (req, res) => {
        const { id } = req.params;
        try {
            const menu = await Menu.findByIdAndDelete(id);
            if (!menu) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "oke",
                message: "berhasil menghapus data",
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data",
                error: error.message,
            });
        }
    },
    searchMenu: async (req, res) => {
        try {
            let jenisBahan = req.query.jenisBahan;

            const jenisBahanOptions = ["sayuran", "buah", "pokok", "lauk", "bumbu", "lainnya"];

            // Jika jenisBahan tidak diinputkan, tampilkan semua jenis bahan
            if (!jenisBahan) {
                jenisBahan = jenisBahanOptions;
            }
            else {
                if (jenisBahan.includes(",")) {
                    jenisBahan = jenisBahan.split(",");
                }
            }

            // Lakukan pencarian menu berdasarkan jenis bahan
            const menus = await Menu.find({
                'bahan.jenis': { $in: jenisBahan } // Menggunakan $in untuk mencocokkan dengan nilai array jenisBahan
            });

            // Pengecekan apakah ada hasil pencarian
            if (!menus || menus.length === 0) {
                return res.status(404).json({
                    status: "Error",
                    message: "Menu tidak ditemukan."
                });
            }

            // Menampilkan hasil pencarian
            res.status(200).json({
                status: "Success",
                message: "Berhasil mencari data",
                data: menus,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mencari data",
                error: error.message,
            });
        }
    },
    searchJenisBahan: async (req, res) => {
        try {
            let jenisBahan = req.query.jenisBahan;

            const jenisBahanOptions = ["sayuran", "buah", "pokok", "lauk"];

            // Jika jenisBahan tidak diinputkan, tampilkan semua jenis bahan
            if (!jenisBahan) {
                jenisBahan = jenisBahanOptions;
            } else {
                jenisBahan = jenisBahan.split(",");
            }

            const menus = await Menu.find({ "bahan.jenis": { $in: jenisBahan } });

            // Pengecekan apakah ada hasil pencarian
            if (!menus || menus.length === 0) {
                return res.status(404).json({
                    status: "Error",
                    message: "Menu tidak ditemukan."
                });
            }

            // Menampilkan hasil pencarian
            res.status(200).json({
                status: "Success",
                message: "Berhasil mencari data",
                data: menus,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mencari data",
                error: error.message,
            });
        }
    },
    generateRandomMenu: async (req, res) => {
        const { ingredients, dailyCalories, id_user } = req.body;
        const days = 6;
        const selectedMenus = [];

        try {
            // Ambil semua menu yang mengandung bahan-bahan yang diinputkan
            const allMenus = await Menu.find({ "bahan.nama": { $in: ingredients } });

            // Buat fungsi untuk memilih menu secara acak
            const getRandomMenu = () => {
                const randomIndex = Math.floor(Math.random() * allMenus.length);
                return allMenus[randomIndex];
            };

            // Inisialisasi total kalori harian yang telah dipilih
            let totalCalories = 0;

            // Lakukan iterasi untuk memilih menu untuk setiap hari
            for (let day = 1; day <= days; day++) {
                const randomMenu = getRandomMenu();
                if (randomMenu) { // Pastikan randomMenu tidak undefined
                    const { menu, bahan, cara_masak, kalori_makanan, waktu_makan, avatar, jenis_bahan, berat_makanan } = randomMenu;
                    selectedMenus.push({
                        day: `Day ${day}`,
                        menu: {
                            menu,
                            bahan,
                            cara_masak,
                            kalori_makanan, // Mengambil kalori_makanan dari randomMenu
                            waktu_makan,
                            avatar,
                            jenis_bahan,
                            berat_makanan
                        }
                    });
                    totalCalories += randomMenu.kalori_makanan;

                    // Pastikan total kalori tidak melebihi jumlah kalori harian
                    if (totalCalories > dailyCalories) {
                        // Jika melebihi, hapus menu terakhir dan keluar dari loop
                        selectedMenus.pop();
                        break;
                    }
                } else {
                    break; // Keluar dari loop jika randomMenu undefined
                }
            }

            // Simpan menu-menu yang dipilih ke dalam skema HistoryMakan
            const historyMakan = new History_makan({
                id_user: id_user,
                menus: selectedMenus
            });

            await historyMakan.save();

            return res.status(200).json(historyMakan);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}
