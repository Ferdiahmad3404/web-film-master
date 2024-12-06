import fetch from 'cross-fetch';

describe('Movies API', () => {
    it('should fetch a list of movies', async () => {
      const response = await fetch('http://localhost:8000/films');
  
      // Validasi status respons
      expect(response.status).toBe(200);  
      
      // Validasi isi data
      const data = await response.json();
      expect(typeof data).toBe('object');

      const totalItems = Object.keys(data.data).length;
      console.log(totalItems);
      
      const expectedTotalFilms = 206;
      const actualTotalFilms = Object.keys(data).length;
      expect(totalItems).toBe(expectedTotalFilms);
    });
    it('should fetch a list of movies'), async
});