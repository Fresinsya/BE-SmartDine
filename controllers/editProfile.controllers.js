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
}