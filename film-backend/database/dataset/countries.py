import psycopg2
import pandas as pd
import chardet

# Path file CSV
csv_file_path = "/var/www/html/database/dataset/countries.csv"

# Deteksi encoding file CSV secara otomatis
with open(csv_file_path, 'rb') as f:
    result = chardet.detect(f.read())
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Baca file CSV dengan encoding yang sesuai
df = pd.read_csv(csv_file_path, encoding=encoding)

# Validasi kolom CSV
expected_columns = ['id', 'country']
if list(df.columns) != expected_columns:
    raise ValueError(f"Kolom dalam CSV harus {expected_columns}, tapi ditemukan {list(df.columns)}")

# Konfigurasi koneksi ke PostgreSQL
conn = psycopg2.connect(
    host="db",
    database="DramaKu",   # Ganti dengan nama database Anda
    user="postgres",       # Ganti dengan username PostgreSQL Anda
    password="postgres",   # Ganti dengan password PostgreSQL Anda
    port="5432"
)
cursor = conn.cursor()

# Fungsi untuk memasukkan data ke dalam tabel 'countries'
def insert_data_to_countries(dataframe):
    for i, row in dataframe.iterrows():
        sql = """
            INSERT INTO countries (id, country) 
            VALUES (%s, %s) 
            ON CONFLICT (id) DO NOTHING
        """
        cursor.execute(sql, (int(row['id']), row['country']))

# Jalankan proses import
try:
    insert_data_to_countries(df)
    conn.commit()
    print("Data berhasil diimpor ke tabel 'countries'.")
except Exception as e:
    conn.rollback()
    print(f"Terjadi kesalahan: {e}")
finally:
    cursor.close()
    conn.close()
