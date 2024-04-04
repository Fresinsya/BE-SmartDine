const User = require("../models/User");

const totalCalories = 3300;

// const hasil = generateDailyMenu(searchResult, totalCalories);


function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}



// FUNGSI TERBARU
function generateDailyMenuDay(searchResult, totalCalories) {
  try {
    let totalDays = 1;
    let dailyMenus = [];
    let sekaliMakan = {};
    let caloriePerServing = (totalCalories / 3);
    let caloriSisa = caloriePerServing;
    console.log({
      targetCalori: totalCalories,
    });
    console.log({
      caloriePerServing,
    });

    sekaliMakan.pokok = getRandomElement(searchResult.pokok);
    sekaliMakan.lauk = getRandomElement(searchResult.lauk);
    sekaliMakan.sayuran = getRandomElement(searchResult.sayuran);

    // console.log("pokok",sekaliMakan.pokok.kalori_makanan);
    // console.log("lauk",sekaliMakan.lauk.kalori_makanan);
    // console.log("sayuran",sekaliMakan.sayuran.kalori_makanan);

    let totalKaloriMakanan =
      sekaliMakan.pokok.kalori_makanan +
      sekaliMakan.lauk.kalori_makanan +
      sekaliMakan.sayuran.kalori_makanan;

    // console.log(totalKaloriMakanan);


    // sekaliMakan.pokok.tambahanGram =
    //   caloriePerServing / sekaliMakan.pokok.kalori_makanan;

    caloriSisa -= sekaliMakan.pokok.kalori_makanan;

    let kaloriYangPerluDitambahAtauKurang =
      (caloriePerServing - totalKaloriMakanan);
    let x = (kaloriYangPerluDitambahAtauKurang / 3);
    // Distribusi perubahan proporsional terhadap setiap item makanan
    sekaliMakan.pokok.kalori_modif = (
      parseInt(sekaliMakan.pokok.kalori_makanan) + x
    ).toFixed(0);
    sekaliMakan.lauk.kalori_modif = (
      parseInt(sekaliMakan.lauk.kalori_makanan) + x
    ).toFixed(0);
    sekaliMakan.sayuran.kalori_modif = (
      parseInt(sekaliMakan.sayuran.kalori_makanan) + x
    ).toFixed(0);

    sekaliMakan.pokok.berat_modif = (
      (parseInt(sekaliMakan.pokok.kalori_modif) *
        parseInt(sekaliMakan.pokok.berat_makanan)) /
      parseInt(sekaliMakan.pokok.kalori_makanan)
    ).toFixed(0);
    sekaliMakan.lauk.berat_modif = (
      (parseInt(sekaliMakan.lauk.kalori_modif) *
        parseInt(sekaliMakan.lauk.berat_makanan)) /
      parseInt(sekaliMakan.lauk.kalori_makanan)
    ).toFixed(0);
    sekaliMakan.sayuran.berat_modif = (
      (parseInt(sekaliMakan.sayuran.kalori_modif) *
        parseInt(sekaliMakan.sayuran.berat_makanan)) /
      parseInt(sekaliMakan.sayuran.kalori_makanan)
    ).toFixed(0);

    // sekaliMakan.pokok.kalori_modif = (
    //   sekaliMakan.pokok.kalori_makanan + x
    // ).toFixed(0);
    // sekaliMakan.lauk.kalori_modif = (
    //   sekaliMakan.lauk.kalori_makanan + x
    // ).toFixed(0);
    // sekaliMakan.sayuran.kalori_modif = (
    //   sekaliMakan.sayuran.kalori_makanan + x
    // ).toFixed(0);
    // sekaliMakan.pokok.berat_modif = (
    //   (sekaliMakan.pokok.kalori_modif *
    //     parseInt(sekaliMakan.pokok.berat_makanan)) /
    //   sekaliMakan.pokok.kalori_makanan
    // ).toFixed(0);
    // sekaliMakan.lauk.berat_modif = (
    //   (sekaliMakan.lauk.kalori_modif *
    //     parseInt(sekaliMakan.lauk.berat_makanan)) /
    //   sekaliMakan.lauk.kalori_makanan
    // ).toFixed(0);
    // sekaliMakan.sayuran.berat_modif = (
    //   (sekaliMakan.sayuran.kalori_modif *
    //     parseInt(sekaliMakan.sayuran.berat_makanan)) /
    //   sekaliMakan.sayuran.kalori_makanan
    // ).toFixed(0);


    const pokokKaloriModif = sekaliMakan.pokok.kalori_modif;
    const laukKaloriModif = sekaliMakan.lauk.kalori_modif;
    const sayuranKaloriModif = sekaliMakan.sayuran.kalori_modif;
    const pokokBeratModif = sekaliMakan.pokok.berat_modif;
    const laukBeratModif = sekaliMakan.lauk.berat_modif;
    const sayuranBeratModif = sekaliMakan.sayuran.berat_modif;


    return { ...sekaliMakan, pokokKaloriModif, laukKaloriModif, sayuranKaloriModif, pokokBeratModif, laukBeratModif, sayuranBeratModif };
  } catch (error) {
    throw new Error(error.message);
  }
}

const searchResult2 = {
  pokok: [
    {
      _id: "66058c38247e44833dab66e6",
      menu: "Nasi Putih",
      ingredients: [],
      bahan: [
        {
          nama: "Nasi Putih",
          jenis: "pokok",
          jumlah: "200 gram",
          _id: "66058c38247e44833dab66e7",
        },
      ],
      cara_masak: [],
      kalori_makanan: 350,
      waktu_makan: [],
      avatar:
        "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711198057/piring_gbndqt.jpg",
      jenis_bahan: [],
      berat_makanan: "200",
      tgl_input: "2024-03-28T15:26:48.207Z",
      __v: 0,
    },
    {
      _id: "66058c60247e44833dab6729",
      menu: "Nasi Merah",
      ingredients: [],
      bahan: [
        {
          nama: "Nasi Merah",
          jenis: "pokok",
          jumlah: "200 gram",
          _id: "66058c60247e44833dab672a",
        },
      ],
      cara_masak: [],
      kalori_makanan: 220,
      waktu_makan: [],
      avatar:
        "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711198057/piring_gbndqt.jpg",
      jenis_bahan: [],
      berat_makanan: "200",
      tgl_input: "2024-03-28T15:27:28.645Z",
      __v: 0,
    },
  ],
  lauk: [
    {
      _id: "6605022cb8ff9db01795dc15",
      menu: "Dada ayam goreng (dengan kulit)",
      ingredients: [],
      bahan: [],
      cara_masak: [],
      kalori_makanan: 432,
      waktu_makan: [],
      avatar:
        "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711604553/vuj1b89vnjgxr8mduual.jpg",
      jenis_bahan: [],
      berat_makanan: "200",
      tgl_input: "2024-03-28T05:37:48.160Z",
      __v: 0,
    },
    {
      _id: "660586ec247e44833dab6450",
      menu: "Bebek Goreng",
      ingredients: [],
      bahan: [],
      cara_masak: [],
      kalori_makanan: 572,
      waktu_makan: [],
      avatar:
        "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711638252/oqrdhsi1rylpmhr1es4t.jpg",
      jenis_bahan: [],
      berat_makanan: "200",
      tgl_input: "2024-03-28T15:04:12.960Z",
      __v: 0,
    },
  ],
  sayuran: [
    {
      _id: "66058a7a247e44833dab6526",
      menu: "Tumis Labu Siam",
      ingredients: [],
      bahan: [],
      cara_masak: [],
      kalori_makanan: 212,
      waktu_makan: [],
      avatar:
        "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711639162/siwncxyb5zuaumcteson.jpg",
      jenis_bahan: [],
      berat_makanan: "200",
      tgl_input: "2024-03-28T15:19:22.418Z",
      __v: 0,
    },
  ],
};


// const hasil = generateDailyMenu(searchResult, totalCalories);
// const hasil2 = generateDailyMenuDay(searchResult, totalCalories);
// console.log(hasil2);


module.exports = generateDailyMenuDay;