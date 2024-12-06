import subprocess
import os

# Daftar file script yang akan dijalankan sesuai urutan
scripts = [
    "/var/www/html/database/dataset/countries.py",
    "/var/www/html/database/dataset/genres.py",
    "/var/www/html/database/dataset/actors.py",
    "/var/www/html/database/dataset/dramas.py",
    "/var/www/html/database/dataset/dramas_actors.py",
    "/var/www/html/database/dataset/dramas_genres.py",
    "/var/www/html/database/dataset/awards.py",
]

def run_script(script_path):
    try:
        # Jalankan script dengan subprocess
        print(f"Menjalankan {script_path}...")
        result = subprocess.run(["/var/www/html/venv/bin/python", script_path], check=True, text=True, capture_output=True)
        print(f"Output {script_path}:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Kesalahan saat menjalankan {script_path}:\n{e.stderr}")
        raise

def main():
    # Loop menjalankan setiap script
    for script in scripts:
        script_path = os.path.abspath(script)
        if os.path.exists(script_path):
            run_script(script_path)
        else:
            print(f"File tidak ditemukan: {script_path}")

if __name__ == "__main__":
    main()
