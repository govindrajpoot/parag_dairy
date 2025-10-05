import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing critical API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test signup endpoint
    console.log('\n2. Testing signup endpoint...');
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'testpass123',
        role: 'Admin'
      })
    });

    const signupData = await signupResponse.json();
    console.log('Signup response:', signupData);

    // Test signin endpoint (if signup was successful)
    if (signupData.success) {
      console.log('\n3. Testing signin endpoint...');
      const signinResponse = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'testpass123'
        })
      });

      const signinData = await signinResponse.json();
      console.log('Signin response:', signinData);
    } else {
      console.log('\n3. Skipping signin test due to signup failure');
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
