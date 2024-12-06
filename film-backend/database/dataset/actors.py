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
csv_file_path = "/var/www/html/database/dataset/actors.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns = ['id', 'name', 'birth_date', 'url_photos', 'country_id']
if not set(expected_columns).issubset(df.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns}, tapi ditemukan {list(df.columns)}")

# Mengubah format tanggal ke YYYY-MM-DD
df['birth_date'] = pd.to_datetime(df['birth_date'], format='%d/%m/%Y').dt.strftime('%Y-%m-%d')

# Kosongkan tabel 'actors' beserta referensi foreign key
cursor.execute("TRUNCATE TABLE actors RESTART IDENTITY CASCADE")
print("Data dalam tabel 'actors' berhasil dikosongkan.")

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_postgres(dataframe, table):
    for _, row in dataframe.iterrows():
        # Mengatur urutan kolom sesuai dengan yang ada di database
        sql = f"""
            INSERT INTO {table} (id, name, url_photos, birth_date, country_id) 
            VALUES (%s, %s, %s, %s, %s)
        """
        try:
            # Debugging output
            print(f"Memasukkan data - ID: {row['id']}, Nama: {row['name']}, Tanggal Lahir: {row['birth_date']}, URL Foto: {row['url_photos']}, ID Negara: {row['country_id']}")

            # Eksekusi query dengan data yang di-cast menjadi tuple
            cursor.execute(sql, (row['id'], row['name'], row['url_photos'], row['birth_date'], row['country_id']))
            # Commit setelah setiap insert
            conn.commit()
        except Exception as e:
            # Cetak kesalahan dan rollback
            print(f"Error pada baris id {row['id']}: {e}")
            conn.rollback()  # Rollback untuk mengabaikan perubahan

# Jalankan fungsi insert
insert_data_to_postgres(df, 'actors')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
