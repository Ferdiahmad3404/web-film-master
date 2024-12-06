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

# Path ke file CSV untuk tabel genres
csv_file_path = "/var/www/html/database/dataset/genres.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df_genres = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns_genres = ['id', 'genre']
if not set(expected_columns_genres).issubset(df_genres.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns_genres}, tapi ditemukan {list(df_genres.columns)}")

# Kosongkan tabel 'genres'
cursor.execute("TRUNCATE TABLE genres RESTART IDENTITY CASCADE")
print("Data dalam tabel 'genres' berhasil dikosongkan.")

# Menghapus duplikat di dataframe
df_genres = df_genres.drop_duplicates(subset=['id'])

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_genres(dataframe, table):
    for _, row in dataframe.iterrows():
        genre_id = int(row.get('id'))  # Mengkonversi ke int
        genre = row.get('genre')  # Ambil genre
        
        sql = f"""
            INSERT INTO {table} (id, genre) 
            VALUES (%s, %s)
            ON CONFLICT (id) DO NOTHING
        """
        try:
            cursor.execute(sql, (genre_id, genre))
            conn.commit()
        except Exception as e:
            print(f"Error pada baris id {genre_id} dan genre {genre}: {e}")
            conn.rollback()

# Jalankan fungsi insert
insert_data_to_genres(df_genres, 'genres')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
