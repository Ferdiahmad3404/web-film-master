#!/bin/bash

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Tunggu hingga database siap
log "Menunggu database siap..."
until pg_isready -h db -p 5432; do
  log "Database belum siap. Coba lagi dalam 2 detik..."
  sleep 2
done
log "Database siap!"

# Aktifkan virtual environment
log "Mengaktifkan virtual environment Python..."
source /var/www/html/venv/bin/activate

# Cek apakah setup sudah dilakukan
if [ ! -f /var/www/html/setup_done ]; then
  log "Menjalankan migrasi database..."
  php artisan migrate --force

  log "Menjalankan import data dengan virtual environment..."
  python /var/www/html/main_import.py

  log "Menjalankan seeder database..."
  php artisan db:seed --force

  log "Menandai bahwa setup sudah selesai."
  touch /var/www/html/setup_done
else
  log "Setup sudah dilakukan sebelumnya. Melewati proses setup."
fi
# Jalankan aplikasi Laravel
log "Menjalankan server Laravel..."
exec php artisan serve --host=0.0.0.0 --port=3001


