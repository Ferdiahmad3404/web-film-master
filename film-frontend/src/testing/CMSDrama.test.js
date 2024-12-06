import fetch from 'cross-fetch';
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// TRUE TESTING

// 
// Testing get all dramas
// 
test('get all dramas', async () => {
  const response = await fetch('http://localhost:8000/films');
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.data).toBeDefined();

  data.data.forEach(drama => {
    expect(drama).toHaveProperty('id');
    expect(drama).toHaveProperty('title');
    expect(drama).toHaveProperty('alt_title');
    expect(drama).toHaveProperty('description');
    expect(drama).toHaveProperty('trailer');
    expect(drama).toHaveProperty('stream_site');
    expect(drama).toHaveProperty('year');
    expect(drama).toHaveProperty('status');
    expect(drama).toHaveProperty('url_cover');
    expect(drama).toHaveProperty('country_id');
  });
});

// 
// Testing add drama
// 
test('add drama to backend with local file', async () => {
  const formData = new FormData();

  // Path ke file lokal
  const filePath = path.join(__dirname, 'assets/test-drama-poster.jpg');

  // Baca file dan tambahkan ke FormData
  const file = fs.createReadStream(filePath);
  formData.append('title', 'Test Drama');
  formData.append('alt_title', '-');
  formData.append('description', 'Test drama description');
  formData.append('trailer', 'http://example.com/trailer');
  formData.append('stream_site', 'netflix');
  formData.append('year', 2024);
  formData.append('status', 'pending');
  formData.append('created_by', 'test');
  formData.append('country_id', 1);
  formData.append('poster', file);

  // Kirim ke backend
  const response = await fetch('http://localhost:8000/films', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  // Pastikan respons berhasil
  expect(response.status).toBe(201);
  expect(result.success).toBe(true);

  // Verifikasi data cmsdramainput
  expect(result.data.title).toBe('Test Drama');
  expect(result.data.alt_title).toBe('-');
  expect(result.data.description).toBe('Test drama description');
  expect(result.data.trailer).toBe('http://example.com/trailer');
  expect(result.data.stream_site).toBe('netflix');
  expect(result.data.year).toBe('2024');
  expect(result.data.status).toBe('pending');
  expect(result.data.created_by).toBe('test');
  expect(result.data.country_id).toBe('1');
});

// 
// Testing update drama
// 
test('edit drama in backend', async () => {
  const formData = new FormData();
  const filePath = path.join(__dirname, 'assets/test-drama-poster.jpg');
  const file = fs.createReadStream(filePath);

  formData.append('title', 'Updated Drama');
  formData.append('alt_title', '-');
  formData.append('description', 'Test updated description');
  formData.append('trailer', 'http://example.com/trailer');
  formData.append('stream_site', 'netflix');
  formData.append('year', 2023);
  formData.append('status', 'pending');
  formData.append('created_by', 'test');
  formData.append('country_id', 2);
  formData.append('poster', file);

  const response = await fetch('http://localhost:8000/films/230', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  // Pastikan respons berhasil
  expect(response.status).toBe(200);
  expect(result.success).toBe(true);

  // Verifikasi data yang diperbarui
  expect(result.data.title).toBe('Updated Drama');
  expect(result.data.year).toBe('2023');
  expect(result.data.country_id).toBe('2');
});

// 
// Testing delete drama
// 
test('delete drama in backend', async () => {
  const dramaId = 232;

  const response = await fetch(`http://localhost:8000/films/${dramaId}`, {
    method: 'DELETE',
  });

  // Pastikan respons berhasil
  expect(response.status).toBe(200);

  const result = await response.json();

  // Verifikasi pesan sukses
  expect(result.success).toBe(true);
  expect(result.message).toBe('Drama and all related data deleted successfully');
});