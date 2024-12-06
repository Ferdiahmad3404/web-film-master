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

# Path ke file CSV untuk tabel dramas_actors
csv_file_path = "/var/www/html/database/dataset/dramas_actors.csv"

# Deteksi encoding menggunakan chardet
with open(csv_file_path, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Encoding terdeteksi: {encoding}")

# Membaca data dari file CSV
df_dramas_actors = pd.read_csv(csv_file_path, encoding=encoding)

# Memastikan kolom yang relevan ada
expected_columns_dramas_actors = ['drama_id', 'actor_id']
if not set(expected_columns_dramas_actors).issubset(df_dramas_actors.columns):
    raise ValueError(f"Kolom dalam CSV harus {expected_columns_dramas_actors}, tapi ditemukan {list(df_dramas_actors.columns)}")

# Kosongkan tabel 'dramas_actors' beserta referensi foreign key
cursor.execute("TRUNCATE TABLE dramas_actors RESTART IDENTITY CASCADE")
print("Data dalam tabel 'dramas_actors' berhasil dikosongkan.")

# Menghapus duplikat di dataframe
df_dramas_actors = df_dramas_actors.drop_duplicates(subset=['drama_id', 'actor_id'])

# Ambil semua drama_id yang valid dari tabel dramas
cursor.execute("SELECT id FROM dramas")
valid_drama_ids = {row[0] for row in cursor.fetchall()}

# Filter dataframe untuk hanya menyimpan drama_id yang valid
df_dramas_actors = df_dramas_actors[df_dramas_actors['drama_id'].isin(valid_drama_ids)]

# Fungsi untuk memasukkan data ke dalam tabel PostgreSQL
def insert_data_to_dramas_actors(dataframe, table):
    for _, row in dataframe.iterrows():
        # Mengatur urutan kolom sesuai dengan yang ada di database
        drama_id = int(row.get('drama_id'))  # Mengkonversi ke int
        actor_id = int(row.get('actor_id'))  # Mengkonversi ke int
        
        sql = f"""
            INSERT INTO {table} (drama_id, actor_id) 
            VALUES (%s, %s)
            ON CONFLICT (drama_id, actor_id) DO NOTHING
        """
        try:
            cursor.execute(sql, (drama_id, actor_id))
            conn.commit()
        except Exception as e:
            print(f"Error pada baris drama_id {drama_id} dan actor_id {actor_id}: {e}")
            conn.rollback()

# Jalankan fungsi insert
insert_data_to_dramas_actors(df_dramas_actors, 'dramas_actors')

# Tutup koneksi
cursor.close()
conn.close()
print("Proses selesai.")
