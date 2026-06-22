const BACKEND_URL = 'http://localhost:8082/api';

async function runTests() {
  console.log('--- STARTING APTAMP END-TO-END REST API TESTS ---');
  let adminToken = '';
  let playerToken = '';
  let playerId = null;

  // TEST 1: Admin login
  console.log('\n[TEST 1] Admin login...');
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin@aptamp.org',
        password: 'Admin@123'
      })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      console.log('✅ Admin login SUCCESSFUL!');
      adminToken = data.token;
    } else {
      console.error('❌ Admin login FAILED:', data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Admin login error:', err.message);
    process.exit(1);
  }

  // TEST 2: Register a new player
  console.log('\n[TEST 2] Register new player...');
  const playerEmail = `testplayer_${Date.now()}@aptamp.com`;
  const playerMobile = '9' + Math.floor(100000000 + Math.random() * 900000000);
  const registerPayload = {
    name: 'E2E Test Athlete',
    email: playerEmail,
    password: 'PlayerPassword@123',
    mobile: playerMobile,
    dateOfBirth: '1998-05-15',
    gender: 'MALE',
    fatherName: 'Father of Athlete',
    district: 'Krishna',
    category: 'SENIOR',
    photoUrl: '/api/files/download?objectName=testphoto.png',
    state: 'Andhra Pradesh'
  };

  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    const data = await res.json();
    if (res.ok && data.email) {
      console.log('✅ Player registration SUCCESSFUL!');
    } else {
      console.error('❌ Player registration FAILED:', data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Player registration error:', err.message);
    process.exit(1);
  }

  // TEST 3: Admin approves player
  console.log('\n[TEST 3] Admin approving player...');
  let databasePlayerId = null;
  try {
    const resList = await fetch(`${BACKEND_URL}/players/search`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const players = await resList.json();
    const foundPlayer = players.find(p => p.email === playerEmail);
    databasePlayerId = foundPlayer.id;

    const resApprove = await fetch(`${BACKEND_URL}/players/${databasePlayerId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (resApprove.ok) {
      console.log('✅ Admin player approval SUCCESSFUL!');
    } else {
      console.error('❌ Admin player approval FAILED');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Admin player approval error:', err.message);
    process.exit(1);
  }

  // TEST 4: Create notification
  console.log('\n[TEST 4] Creating notification...');
  try {
    const res = await fetch(`${BACKEND_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'E2E Notice Broadcast',
        message: 'This is a test notification message for E2E.',
        type: 'announcement'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Notification creation SUCCESSFUL!');
    } else {
      console.error('❌ Notification creation FAILED:', data);
    }
  } catch (err) {
    console.error('❌ Notification creation error:', err.message);
  }

  // TEST 5: Create tournament
  console.log('\n[TEST 5] Creating tournament...');
  const tournamentPayload = {
    title: 'E2E Test Tournament',
    description: 'This is a test tournament description.',
    venue: 'Krishna Stadium',
    organizer: 'APTA District Office',
    entryFee: 150.00,
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    registrationDeadline: new Date('2026-06-25T12:00:00.000Z').toISOString(),
    status: 'PUBLISHED',
    categories: [
      {
        categoryName: 'Sub-Junior',
        gender: 'MALE',
        minAge: 8,
        maxAge: 14
      }
    ]
  };

  try {
    const res = await fetch(`${BACKEND_URL}/tournaments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tournamentPayload)
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Tournament creation SUCCESSFUL!');
    } else {
      console.error('❌ Tournament creation FAILED:', data);
    }
  } catch (err) {
    console.error('❌ Tournament creation error:', err.message);
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests();
