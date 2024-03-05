import numpy as np
import pandas as pd
from sklearn.model_selection import KFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
from pymongo.mongo_client import MongoClient
import pymongo
from bson.objectid import ObjectId
import sys
import json

def get_user_by_id(user_id):
    user = collectionUser.find_one({"_id": ObjectId(user_id)})
    return user

def get_riwayat_by_id(riwayat_id):
    riwayat = collection.find_one({"IdUser": ObjectId(riwayat_id)})
    return riwayat

def konversi_tinggi(tinggi_cm):
    tinggi_m = tinggi_cm / 100
    return tinggi_m

def main():
    # Menerima argumen dari baris perintah
    if len(sys.argv) < 2:
        # print("Usage: python knn.py <id>")
        return

    id = sys.argv[1]
    # print("Received ID:", id)

    # Mendapatkan informasi pengguna berdasarkan ID
    user = get_user_by_id(id)
    # print("User Info:", user)

    # Mendapatkan riwayat pengguna berdasarkan ID
    riwayat = get_riwayat_by_id(id)
    # print("Riwayat Info:", riwayat)

    # Memeriksa apakah pengguna dan riwayat ditemukan
    if user and riwayat:
        # Mengonversi tinggi badan dari sentimeter ke meter
        tinggi_m = konversi_tinggi(user['tinggiBadan'])
        # print("Tinggi dalam meter:", tinggi_m)

        data_klasifikasi = [user['beratBadan'], user['usia'], riwayat['FCVC'], riwayat['FAF'], riwayat['TUE'], riwayat['CH20'], riwayat['NCP'], user['gender'], tinggi_m, riwayat['CAEC'], user['family_history'], riwayat['CALC'], riwayat['MTRANS'], riwayat['FACV'], riwayat['SCC']]
        # print(data_klasifikasi)

        # Konversi menjadi format numpy array
        data_numpy = np.array(data_klasifikasi)

        # Membaca dataset
        dataset = pd.read_csv('ObesityDataSet.csv')

        # Mengubah label menjadi numerik
        dataset.Gender.replace({"Male": 1, "Female":0}, inplace=True)
        dataset.family_history_with_overweight.replace({"no":0 , "yes":1}, inplace=True)
        dataset.FAVC.replace({"no":0 , "yes":1}, inplace=True)
        dataset.CAEC.replace({"no":0 , "Frequently":1, "Sometimes":2, "Always":3}, inplace=True)
        dataset.SMOKE.replace({"no":0 , "yes":1}, inplace=True)
        dataset.SCC.replace({"no":0 , "yes":1}, inplace=True)
        dataset.CALC.replace({"no":0 , "Frequently":1, "Sometimes":2, "Always":3}, inplace=True)
        dataset.MTRANS.replace({"Automobile":0 , "Motorbike":1, "Bike":2, "Walking":3, "Public_Transportation":4}, inplace=True)

        # Memilih fitur yang akan digunakan
        selected_features = ['Weight','Age','FCVC','FAF', 'TUE','CH2O','NCP','Gender','Height','CAEC','family_history_with_overweight','CALC','MTRANS','FAVC','SCC', 'NObeyesdad']
        dataBaru = dataset[selected_features]

        # Memeriksa label yang unik
        # unique_labels = dataBaru['NObeyesdad'].unique()
        # print("Label unik dalam dataset:")
        # print(unique_labels)

        # Membagi data menjadi fitur dan target
        X = dataBaru.iloc[:, :-1]  
        y = dataBaru.iloc[:, -1]

        # Inisialisasi model KNN dengan k=1
        knn_model = KNeighborsClassifier(n_neighbors=1)

        # Inisialisasi validasi silang dengan k=7
        k = 7
        kf = KFold(n_splits=k, shuffle=True, random_state=42)

        accuracies = []

        # Melakukan validasi silang
        for train_index, test_index in kf.split(X):
            X_train, X_test = X.iloc[train_index], X.iloc[test_index]
            y_train, y_test = y.iloc[train_index], y.iloc[test_index]

            # Melatih model KNN
            knn_model.fit(X_train, y_train)
            
            # Membuat prediksi
            y_pred = knn_model.predict(X_test)
            
            # Menghitung akurasi
            accuracy = accuracy_score(y_test, y_pred)
            accuracies.append(accuracy)

        # Menampilkan akurasi
        # print(f'Akurasi K-Fold Cross-Validation (k={k}):')
        # print(accuracies)
        # print(f'Rata-rata Akurasi: {np.mean(accuracies)*100}')

        hasil_prediksi = knn_model.predict([data_numpy])

        status_berat_badan = hasil_prediksi[0]  # Mengambil status berat badan dari hasil prediksi

        # Membaca status berat badan dan menyesuaikan defisit kalori


        # perhitungan BMR (Basal Metabolic Rate)
        def hitung_bmr(berat_kg, tinggi_cm, usia, gender):
            if gender == 1:  # Pria
                BMR = (10 * berat_kg) + (6.25 * tinggi_cm) - (5 * usia) + 5
            else:  # Wanita
                BMR = (10 * berat_kg) + (6.25 * tinggi_cm) - (5 * usia) - 16
            return BMR

        # Perhitungan TDEE (Total Daily Energy Expenditure)
        def hitung_tdee(BMR, aktivitas):
            if aktivitas == 0:  # Tidak aktif
                TDEE = BMR * 1.2
            elif aktivitas == 1:  # Sedikit aktif
                TDEE = BMR * 1.375
            elif aktivitas == 2:  # Aktif
                TDEE = BMR * 1.55
            elif aktivitas == 3:  # Sangat aktif
                TDEE = BMR * 1.725
            else:  # Super aktif
                TDEE = BMR * 1.9
            return TDEE

        # defisit kalori
        def defisit_kalori(TDEE):
            defisit = 0.20 * TDEE 
            return defisit

        # kalori harian
        def kalori_harian(TDEE, defisit):
            if status_berat_badan == "Underweight":
                kalori = TDEE + defisit
            elif status_berat_badan == "Normal Weight":
                kalori = defisit 
            else:
                kalori = TDEE - defisit
            return kalori
            

        if user:
            # Mengambil atribut pengguna
            berat_kg = user['beratBadan']
            usia = user['usia']
            tinggi_cm = user['tinggiBadan']
            gender = user['gender']
            aktivitas = riwayat['FAF']
            
            
            # Menghitung BMR
            BMR = hitung_bmr(berat_kg, tinggi_cm, usia, gender)
            format_BMR = "{:,.2f}".format(BMR)
            # print("BMR:", BMR)

            # Menghitung TDEE
            TDEE = hitung_tdee(BMR, aktivitas)
            format_TDEE = "{:,.2f}".format(TDEE)
            # print("TDEE:", TDEE)

            # Menghitung defisit kalori
            defisit = defisit_kalori(TDEE)
            format_defisit = "{:,.2f}".format(defisit)
            # print("Defisit Kalori:", defisit)

            # Menghitung kalori harian
            kalori = kalori_harian(TDEE, defisit)
            format_kalori = "{:,.2f}".format(kalori)
            # print("Kalori Harian:", kalori)

            data_json = {
            # "BMR": format_BMR,
            # "TDEE": format_TDEE,
            # "Defisit Kalori": format_defisit,
            "Kalori Harian": format_kalori
            }

            # Mengonversi ke format JSON
            json_data = json.dumps(data_json)

            # Menampilkan JSON
            print(json_data)
            
        else:
            print("Pengguna tidak ditemukan.")
    
    else:
        print("Pengguna atau riwayat tidak ditemukan.")

# Panggil fungsi main
if __name__ == "__main__":
    # Koneksi ke database MongoDB
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["SmartDine"]  # Ganti 'nama_database' dengan nama database Anda
    collection = database["riwayats"]    # Ganti 'riwayat' dengan nama koleksi Anda
    collectionUser = database["users"]    # Ganti 'riwayat' dengan nama koleksi Anda
    
    main()