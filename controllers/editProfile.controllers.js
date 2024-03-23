const Admin = require("../models/Admin");
const Menu = require("../models/Menu");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    editProfile: async (req, res) => {
        const { id } = req.params;

        const { image } = req.body

        const result = await cloudinary.uploader.upload(image);
        const avatarUrl = result.secure_url;
        try {
            const user = await User.findByIdAndUpdate(id, {
                ...req.body,
                avatar: avatarUrl
            }, { new: true })
            if (!user) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil mengubah data",
                    data: user,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengubah data",
                error: error.message,
            });
        }
    },
    editProfileAdmin: async (req, res) => {
        const { id } = req.params;

        const { image } = req.body

        const result = await cloudinary.uploader.upload(image);
        const avatarUrl = result.secure_url;
        try {
            const admin = await Admin.findByIdAndUpdate(id, {
                ...req.body,
                avatar: avatarUrl
            }, { new: true })
            if (!admin) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil mengubah data",
                    data: admin,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengubah data",
                error: error.message,
            });
        }
    },
    editGambarMenu: async (req, res) => {
        const { id } = req.params;
        // const { image } = req.body

        try {

            let avatarUrl = "https://i.stack.imgur.com/l60Hf.png";

            if (req.body.avatar) {
                const result = await cloudinary.uploader.upload(req.body.avatar);
                avatarUrl = result.secure_url;
            }
            // const result = await cloudinary.uploader.upload(image);
            // const avatarUrl = result.secure_url;

            const menu = await Menu.findByIdAndUpdate(id, {
                ...req.body,
                avatar: avatarUrl,
            }, { new: true })
            if (!menu) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil mengubah data",
                    data: menu,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengubah data",
                error: error.message,
            });
        }
    },
}