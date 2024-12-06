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

# Path ke file CSV untuk tabel dramas
csv_file_path = "/var/www/html/database/dataset/dramas.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df_dramas = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns_dramas = ['id', 'title', 'url_cover', 'alt_title', 'year', 'country_id', 'description', 'stream_site', 'trailer', 'status', 'created_by']
if not set(expected_columns_dramas).issubset(df_dramas.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns_dramas}, tapi ditemukan {list(df_dramas.columns)}")

# Kosongkan tabel 'dramas' beserta referensi foreign key
cursor.execute("TRUNCATE TABLE dramas RESTART IDENTITY CASCADE")
print("Data dalam tabel 'dramas' berhasil dikosongkan.")

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_dramas(dataframe, table):
    for _, row in dataframe.iterrows():
        # Pastikan status valid
        if row['status'] not in ['approved', 'unapproved']:
            print(f"Status tidak valid pada baris id {row['id']}: {row['status']}. Hanya 'approved' atau 'unapproved' yang diperbolehkan.")
            continue
        
        # Mengatur urutan kolom sesuai dengan yang ada di database
        sql = f"""
            INSERT INTO {table} (id, title, url_cover, alt_title, year, country_id, description, stream_site, trailer, status, created_by) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        try:
            # Eksekusi query dengan data yang di-cast menjadi tuple
            cursor.execute(sql, (row['id'], row['title'], row['url_cover'], row['alt_title'], row['year'], row['country_id'], row['description'], row['stream_site'], row['trailer'], row['status'], row['created_by']))
            # Commit setelah setiap insert
            conn.commit()
        except Exception as e:
            # Cetak kesalahan dan rollback
            print(f"Error pada baris id {row['id']}: {e}")
            conn.rollback()  # Rollback untuk mengabaikan perubahan

# Jalankan fungsi insert
insert_data_to_dramas(df_dramas, 'dramas')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
