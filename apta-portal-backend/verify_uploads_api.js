const BACKEND_URL = 'http://localhost:8082/api';

async function runUploadsTest() {
  console.log('--- STARTING UPLOADS & METADATA FLOW TESTS ---');
  let adminToken = '';

  // 1. Admin login
  console.log('\n[STEP 1] Login as admin...');
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

  // 2. Upload Circular Document
  console.log('\n[STEP 2] Uploading circular file...');
  let circularObjectName = '';
  try {
    // A. Get upload URL
    const resUrl = await fetch(`${BACKEND_URL}/files/upload-url?filename=circular.pdf&contentType=application/pdf&folder=circulars`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const uploadInfo = await resUrl.json();
    circularObjectName = uploadInfo.objectName;
    console.log(`  Upload URL: ${uploadInfo.url}`);
    console.log(`  ObjectName: ${circularObjectName}`);

    // B. PUT the actual file
    const putRes = await fetch(uploadInfo.url, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/pdf',
        'Authorization': `Bearer ${adminToken}`
      },
      body: 'Dummy PDF Circular File Content'
    });
    if (putRes.ok) {
      console.log('✅ Circular file upload PUT SUCCESSFUL!');
    } else {
      console.error('❌ Circular file upload PUT FAILED:', putRes.statusText);
      process.exit(1);
    }

    // C. Save metadata in Downloads
    console.log('  Saving Circular metadata to Downloads database...');
    const postRes = await fetch(`${BACKEND_URL}/downloads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Official Player Registration Circular 2026',
        description: 'Official notification document outlining entry procedures, forms, and fees.',
        category: 'CIRCULARS',
        objectName: circularObjectName,
        type: 'PDF',
        size: '1.5 MB'
      })
    });
    const postData = await postRes.json();
    if (postRes.ok && postData.success) {
      console.log('✅ Circular metadata persistence SUCCESSFUL!');
    } else {
      console.error('❌ Circular metadata persistence FAILED:', postData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Circular upload flow error:', err.message);
    process.exit(1);
  }

  // 3. Upload Gallery Image
  console.log('\n[STEP 3] Uploading gallery image...');
  let galleryObjectName = '';
  try {
    // A. Get upload URL
    const resUrl = await fetch(`${BACKEND_URL}/files/upload-url?filename=gallery_photo.png&contentType=image/png&folder=gallery`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const uploadInfo = await resUrl.json();
    galleryObjectName = uploadInfo.objectName;
    console.log(`  Upload URL: ${uploadInfo.url}`);
    console.log(`  ObjectName: ${galleryObjectName}`);

    // B. PUT the actual image
    const putRes = await fetch(uploadInfo.url, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'image/png',
        'Authorization': `Bearer ${adminToken}`
      },
      body: 'Dummy PNG Image File Content'
    });
    if (putRes.ok) {
      console.log('✅ Gallery image upload PUT SUCCESSFUL!');
    } else {
      console.error('❌ Gallery image upload PUT FAILED:', putRes.statusText);
      process.exit(1);
    }

    // C. Save metadata in Gallery
    console.log('  Saving Gallery metadata to Gallery database...');
    const postRes = await fetch(`${BACKEND_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Championship Court View',
        type: 'IMAGE',
        url: galleryObjectName
      })
    });
    const postData = await postRes.json();
    if (postRes.ok && postData.success) {
      console.log('✅ Gallery metadata persistence SUCCESSFUL!');
    } else {
      console.error('❌ Gallery metadata persistence FAILED:', postData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Gallery upload flow error:', err.message);
    process.exit(1);
  }

  // 4. Verify Downloads retrieval
  console.log('\n[STEP 4] Verifying Circular is visible in downloads retrieval...');
  try {
    const res = await fetch(`${BACKEND_URL}/downloads`);
    const downloads = await res.json();
    const found = downloads.find(d => d.objectName === circularObjectName || (d.name && d.name.includes('Player Registration Circular')));
    if (found) {
      console.log('✅ Verifying Circular retrieved from DB successfully!');
      console.log(`  Retrieved URL: ${found.fileUrl}`);
    } else {
      console.error('❌ Circular NOT found in DB list retrieval!');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Downloads verify error:', err.message);
    process.exit(1);
  }

  // 5. Verify Gallery retrieval
  console.log('\n[STEP 5] Verifying Image is visible in gallery retrieval...');
  try {
    const res = await fetch(`${BACKEND_URL}/gallery`);
    const gallery = await res.json();
    const found = gallery.find(g => g.url.includes(galleryObjectName));
    if (found) {
      console.log('✅ Verifying Gallery image retrieved from DB successfully!');
      console.log(`  Retrieved URL: ${found.url}`);
    } else {
      console.error('❌ Gallery image NOT found in DB list retrieval!');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Gallery verify error:', err.message);
    process.exit(1);
  }

  console.log('\n--- UPLOADS & METADATA FLOW TESTS COMPLETED SUCCESSFULLY ---');
}

runUploadsTest();
