import fetch from 'cross-fetch';

describe('User Login', () => {
    it('should return a token for valid credentials', async () => {
        const credentials = {
            identifier: 'user1@example.com', // Replace with a valid email or username
            password: 'password123' // Replace with a valid password
        };

        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
       
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('access_token');
        expect(data).toHaveProperty('token_type', 'bearer');
        expect(data).toHaveProperty('expires_in');
        expect(data).toHaveProperty('role_id');
        expect(data).toHaveProperty('id');
    });

    it('should return 401 for invalid credentials', async () => {
        const credentials = {
            identifier: 'user1@example.com',
            password: 'invalidPassword'
        };

        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        expect(response.status).toBe(401);
        expect(data).toHaveProperty('error', 'Unauthorized');
    });

    // it('should return 403 for suspended accounts', async () => {
    //     const credentials = {
    //         identifier: 'user2@example.com', // Replace with a suspended user's email
    //         password: 'password123'
    //     };

    //     const response = await fetch('http://localhost:8000/api/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(credentials)
    //     });

    //     const data = await response.json();
    //     console.log(data);
    //     expect(response.status).toBe(403); // Corrected status code for suspended accounts
    //     // expect(data).toHaveProperty('error', 'Account is suspended');
    //     // expect(data).toHaveProperty('suspended_until');
    // });
});
