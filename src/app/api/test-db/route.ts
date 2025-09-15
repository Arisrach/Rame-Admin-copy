import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rame_admin'
  };

  console.log('Testing database connection with config:', {
    host: connectionConfig.host,
    user: connectionConfig.user,
    database: connectionConfig.database
    // Don't log password for security
  });

  let connection;
  try {
    console.log('Attempting to connect to database...');
    connection = await mysql.createConnection(connectionConfig);
    
    // Test a simple query
    console.log('Executing test query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    
    await connection.end();
    
    console.log('Database connection test successful');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      testResult: rows
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}