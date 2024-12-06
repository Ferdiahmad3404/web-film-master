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

# Path ke file CSV untuk tabel dramas_genres
csv_file_path = "/var/www/html/database/dataset/dramas_genres.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df_dramas_genres = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns_dramas_genres = ['genre_id', 'drama_id']
if not set(expected_columns_dramas_genres).issubset(df_dramas_genres.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns_dramas_genres}, tapi ditemukan {list(df_dramas_genres.columns)}")

# Kosongkan tabel 'dramas_genres' beserta referensi foreign key
cursor.execute("TRUNCATE TABLE dramas_genres RESTART IDENTITY CASCADE")
print("Data dalam tabel 'dramas_genres' berhasil dikosongkan.")

# Menghapus duplikat di dataframe
df_dramas_genres = df_dramas_genres.drop_duplicates(subset=['genre_id', 'drama_id'])

# Ambil semua drama_id yang valid dari tabel dramas
cursor.execute("SELECT id FROM dramas")
valid_drama_ids = {row[0] for row in cursor.fetchall()}

# Filter dataframe untuk hanya menyimpan drama_id yang valid
df_dramas_genres = df_dramas_genres[df_dramas_genres['drama_id'].isin(valid_drama_ids)]

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_dramas_genres(dataframe, table):
    for _, row in dataframe.iterrows():
        # Mengatur urutan kolom sesuai dengan yang ada di database
        genre_id = int(row.get('genre_id'))  # Mengkonversi ke int
        drama_id = int(row.get('drama_id'))  # Mengkonversi ke int
        
        sql = f"""
            INSERT INTO {table} (genre_id, drama_id) 
            VALUES (%s, %s)
            ON CONFLICT (genre_id, drama_id) DO NOTHING
        """
        try:
            cursor.execute(sql, (genre_id, drama_id))
            conn.commit()
        except Exception as e:
            print(f"Error pada baris genre_id {genre_id} dan drama_id {drama_id}: {e}")
            conn.rollback()

# Jalankan fungsi insert
insert_data_to_dramas_genres(df_dramas_genres, 'dramas_genres')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
