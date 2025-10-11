import fetch from 'node-fetch';

async function testDistributorEndpoints() {
  try {
    console.log('Testing Distributor Endpoints...\n');

    // First, get authentication token by signing in
    console.log('1. Getting authentication token...');
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
    if (!signinData.success) {
      console.error('Failed to sign in:', signinData);
      return;
    }

    const token = signinData.data.token;
    console.log('✅ Authentication successful\n');

    // Test GET all distributors
    console.log('2. Testing GET /api/distributors (Get all distributors)...');
    const getAllResponse = await fetch('http://localhost:3000/api/distributors', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const getAllData = await getAllResponse.json();
    console.log('Response:', getAllData);

    if (getAllData.success) {
      console.log('✅ GET all distributors successful\n');
    } else {
      console.log('❌ GET all distributors failed\n');
    }

    // Create a test distributor first
    console.log('3. Creating a test distributor...');
    const createDistributorResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Distributor',
        email: `testdistributor${Date.now()}@example.com`,
        password: 'testpass123',
        role: 'Distributor',
        mobile: '9876543210',
        route: 'Route A',
        openingBalance: 1000
      })
    });

    const createDistributorData = await createDistributorResponse.json();
    console.log('Create distributor response:', createDistributorData);

    let distributorId = null;
    if (createDistributorData.success) {
      distributorId = createDistributorData.data.user.id;
      console.log('✅ Test distributor created with ID:', distributorId, '\n');
    } else {
      console.log('❌ Failed to create test distributor\n');
      return;
    }

    // Test GET distributor by ID
    console.log('4. Testing GET /api/distributors/:id (Get distributor by ID)...');
    const getByIdResponse = await fetch(`http://localhost:3000/api/distributors/${distributorId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const getByIdData = await getByIdResponse.json();
    console.log('Response:', getByIdData);

    if (getByIdData.success) {
      console.log('✅ GET distributor by ID successful\n');
    } else {
      console.log('❌ GET distributor by ID failed\n');
    }

    // Test PUT update distributor
    console.log('5. Testing PUT /api/distributors/:id (Update distributor)...');
    const updateResponse = await fetch(`http://localhost:3000/api/distributors/${distributorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Updated Test Distributor',
        mobile: '1234567890',
        route: 'Route B',
        openingBalance: 2000,
        isActive: true
      })
    });

    const updateData = await updateResponse.json();
    console.log('Response:', updateData);

    if (updateData.success) {
      console.log('✅ PUT update distributor successful\n');
    } else {
      console.log('❌ PUT update distributor failed\n');
    }

    // Test DELETE distributor
    console.log('6. Testing DELETE /api/distributors/:id (Delete distributor)...');
    const deleteResponse = await fetch(`http://localhost:3000/api/distributors/${distributorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const deleteData = await deleteResponse.json();
    console.log('Response:', deleteData);

    if (deleteData.success) {
      console.log('✅ DELETE distributor successful\n');
    } else {
      console.log('❌ DELETE distributor failed\n');
    }

    // Test edge cases
    console.log('7. Testing edge cases...');

    // Test unauthorized access (no token)
    console.log('7a. Testing unauthorized access (no token)...');
    const unauthorizedResponse = await fetch('http://localhost:3000/api/distributors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const unauthorizedData = await unauthorizedResponse.json();
    console.log('Unauthorized response:', unauthorizedData);

    // Test invalid distributor ID
    console.log('7b. Testing invalid distributor ID...');
    const invalidIdResponse = await fetch('http://localhost:3000/api/distributors/99999', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const invalidIdData = await invalidIdResponse.json();
    console.log('Invalid ID response:', invalidIdData);

    console.log('🎉 All distributor endpoint tests completed!');

  } catch (error) {
    console.error('Error testing distributor endpoints:', error.message);
  }
}

testDistributorEndpoints();
