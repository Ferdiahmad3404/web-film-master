// import fetch from 'cross-fetch';

// const FormData = require('form-data');
// const fs = require('fs');
// const path = require('path');

// // TRUE TESTING
// // 
// // Testing get all actor
// // 
// test('get all actor', async () => {
//   const response = await fetch('http://localhost:8000/actors');
//   const data = await response.json();

//   expect(response.status).toBe(200);
//   expect(data.success).toBe(true);
//   expect(data.data).toBeDefined();

//   response.body.forEach(actor => {
//     expect(actor).toHaveProperty('id');
//     expect(actor).toHaveProperty('name');
//     expect(actor).toHaveProperty('birth_date');
//     expect(actor).toHaveProperty('url_photos');
//     expect(actor).toHaveProperty('country_name');
//   });
// });


// // 
// // Testing add actor
// // 
// test('add actor to backend with local file', async () => {
//   const formData = new FormData();

//   // Path ke file lokal
//   const filePath = path.join(__dirname, 'assets/test-actor-poster.jpeg');

//   // Baca file dan tambahkan ke FormData
//   const file = fs.createReadStream(filePath);
//   formData.append('name', 'Test Actor');
//   formData.append('country_id', 1);
//   formData.append('birth_date', '1990-01-01');
//   formData.append('poster', file);

//   // Kirim ke backend
//   const response = await fetch('http://localhost:8000/actors', {
//     method: 'POST',
//     body: formData,
//   });
//   const result = await response.json();

//   // Pastikan respons berhasil
//   expect(response.status).toBe(201);
//   expect(result.success).toBe(true);

//   // Verifikasi data aktor
//   expect(result.data.name).toBe('Test Actor');
//   expect(result.data.country_id).toBe("1");
//   expect(result.data.birth_date).toBe('1990-01-01');
// });


// // 
// // Testing update actor
// // 
// test('edit actor in backend', async () => {
//   const formData = new FormData();
//   const filePath = path.join(__dirname, 'assets/test-actor-poster.jpeg');
//   const file = fs.createReadStream(filePath);
  
//   formData.append('name', 'Updated Actor');
//   formData.append('country_id', 2);
//   formData.append('birth_date', '1992-02-02');
//   formData.append('poster', file);

//   const response = await fetch('http://localhost:8000/actors/982', {
//       method: 'POST',
//       body: formData,
//   });
//   const result = await response.json();

//   // Pastikan respons berhasil
//   expect(response.status).toBe(200);
//   expect(result.success).toBe(true);

//   // Verifikasi data yang diperbarui
//   expect(result.data.name).toBe('Updated Actor');
//   expect(result.data.country_id).toBe("2");
//   expect(result.data.birth_date).toBe('1992-02-02');
// });

// // 
// // Testing delete actors
// // 
// test('delete actor in backend', async () => {
//   const actorId = 983;

//   const response = await fetch(`http://localhost:8000/actors/${actorId}`, {
//       method: 'DELETE',
//   });

//   // Pastikan respons berhasil
//   expect(response.status).toBe(200);

//   const result = await response.json();

//   // Verifikasi pesan sukses
//   expect(result.success).toBe(true);
//   expect(result.message).toBe('Actor and poster deleted successfully');
// });
