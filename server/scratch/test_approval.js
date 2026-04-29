const axios = require('axios');

const PLANTATION_ID = '4b91fc3f-b7e5-4ec4-99ac-24869ddfae07';
const API_URL = 'http://127.0.0.1:5000/api/plantations';

async function testApproval() {
  console.log(`🛡️ Attempting to approve plantation ${PLANTATION_ID}...`);
  try {
    const response = await axios.patch(`${API_URL}/${PLANTATION_ID}/approve`, {}, {
      headers: {
        Authorization: 'Bearer MOCK_ADMIN_TOKEN'
      }
    });
    console.log('✅ Approval Successful!');
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Approval Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testApproval();
