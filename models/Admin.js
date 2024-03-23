const mongoose = require("mongoose");

const AdminSkema = new mongoose.Schema(
    {
        nama: String,
        avatar: {
            type: String,
            default: "https://i.stack.imgur.com/l60Hf.png",
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