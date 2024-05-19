const mongoose = require("mongoose");

const AdminSkema = new mongoose.Schema(
    {
        nama: String,
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dd8tyaph2/image/upload/v1716126670/profilr_zwq5dq.png",
        },
        email: String,
        password: String,
        confirmPassword: String,
        alamat: String,
        gender: Number,
        telepon: Number
    }
)

const Admin = mongoose.model("Admin", AdminSkema)
module.exports = Admin