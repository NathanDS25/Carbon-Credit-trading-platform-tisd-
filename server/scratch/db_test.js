const { Client } = require('pg');

async function testConnection() {
  // We'll test with the direct port 5432 first
  const connectionString = 'postgresql://postgres.lqdlnxlkfevzkssxirab:Crackinmya$$69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';
  
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('⏳ Attempting to connect to Supabase directly...');
    await client.connect();
    console.log('✅ DIRECT CONNECTION SUCCESSFUL!');
    const res = await client.query('SELECT NOW()');
    console.log('Current Time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ DIRECT CONNECTION FAILED!');
    console.error('Error details:', err.message);
    
    console.log('⏳ Trying with Percent Encoding (%24%24)...');
    const encodedString = 'postgresql://postgres.lqdlnxlkfevzkssxirab:Crackinmya%24%2469@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';
    const client2 = new Client({ connectionString: encodedString });
    try {
        await client2.connect();
        console.log('✅ ENCODED CONNECTION SUCCESSFUL!');
        await client2.end();
    } catch (err2) {
        console.error('❌ ENCODED CONNECTION ALSO FAILED!');
        console.error('Error details:', err2.message);
    }
  }
}

testConnection();
