const mysql = require('mysql2/promise');

// Use environment variables
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rame_admin'
};

async function testConnection() {
  console.log('Testing database connection with config:');
  console.log('Host:', connectionConfig.host);
  console.log('User:', connectionConfig.user);
  console.log('Database:', connectionConfig.database);
  // Don't log password for security

  let connection;
  try {
    console.log('\nAttempting to connect to database...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Successfully connected to the database!');
    
    // Test a simple query
    console.log('\nTesting a simple query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query executed successfully:', rows);
    
    await connection.end();
    console.log('\n✅ Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
    
    // Common error explanations
    switch (error.code) {
      case 'ECONNREFUSED':
        console.log('\n💡 Tip: Connection refused. Check if:');
        console.log('  - DB_HOST is correct');
        console.log('  - MySQL server is running');
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('\n💡 Tip: Access denied. Check if:');
        console.log('  - DB_USER and DB_PASSWORD are correct');
        console.log('  - User has permission to access the database');
        break;
      case 'ER_BAD_DB_ERROR':
        console.log('\n💡 Tip: Unknown database. Check if:');
        console.log('  - DB_NAME is correct');
        console.log('  - Database exists');
        break;
      case 'ENOTFOUND':
        console.log('\n💡 Tip: Host not found. Check if:');
        console.log('  - DB_HOST is correct');
        console.log('  - DNS resolution is working');
        break;
      default:
        console.log('\n💡 Check your database credentials and network connectivity');
    }
  }
}

testConnection();