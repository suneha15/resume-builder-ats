// Simple database connection test
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Found' : 'Not found');
    
    await client.connect();
    console.log('✅ Connected to database successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    // Check if our tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('✅ Available tables:', tablesResult.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
