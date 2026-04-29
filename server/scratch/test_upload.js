const axios = require('axios');

async function testUpload() {
  try {
    console.log('🚀 Starting Test Plantation Upload...');
    
    console.log('🚀 Sending POST request to /api/plantations...');
    const response = await axios.post('http://127.0.0.1:5000/api/plantations', {
      name: 'Amazon Rainforest Project',
      lat: -3.4653,
      lng: -62.2159,
      areaSqKm: 50,
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    }, {
      headers: {
        Authorization: 'Bearer MOCK_ADMIN_TOKEN', 
      },
    });

    console.log('✅ Upload success! Check the Worker terminal for analysis results.');
    console.log('Data:', response.data);
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
  }
}

testUpload();
