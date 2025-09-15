import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rame_admin'
  };

  let connection;
  try {
    console.log('Testing database connection...');
    connection = await mysql.createConnection(connectionConfig);
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    
    await connection.end();
    
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