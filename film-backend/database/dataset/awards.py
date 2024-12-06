import psycopg2
import pandas as pd
import chardet

# Konfigurasi koneksi ke database PostgreSQL
conn = psycopg2.connect(
    host="db",
    database="DramaKu",
    user="postgres",
    password="postgres",
    port="5432"
)
cursor = conn.cursor()

# Path ke file CSV
csv_file_path = "/var/www/html/database/dataset/awards.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns = ['id', 'award', 'year', 'country_id', 'drama_id']
if not set(expected_columns).issubset(df.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns}, tapi ditemukan {list(df.columns)}")

# Mengubah kolom 'year' menjadi integer
df['year'] = df['year'].astype(int)

# Kosongkan tabel 'awards' beserta referensi foreign key
cursor.execute("TRUNCATE TABLE awards RESTART IDENTITY CASCADE")
print("Data dalam tabel 'awards' berhasil dikosongkan.")

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_postgres(dataframe, table):
    for _, row in dataframe.iterrows():
        sql = f"""
            INSERT INTO {table} (id, award, year, country_id, drama_id) 
            VALUES (%s, %s, %s, %s, %s)
        """
        try:
            # Debugging output
            print(f"Memasukkan data - ID: {row['id']}, Award: {row['award']}, Tahun: {row['year']}, ID Negara: {row['country_id']}, ID Drama: {row['drama_id']}")
            cursor.execute(sql, (row['id'], row['award'], row['year'], row['country_id'], row['drama_id']))
            conn.commit()
        except Exception as e:
            print(f"Error pada baris id {row['id']}: {e}")
            conn.rollback()

# Jalankan fungsi insert
insert_data_to_postgres(df, 'awards')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
