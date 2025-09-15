import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { authenticateUser } from '@/lib/auth';

export async function GET() {
  try {
    // Test Redis connection by setting and getting a value
    const testKey = 'test_connection';
    const testValue = 'success';
    
    await redis.set(testKey, testValue);
    const result = await redis.get(testKey);
    
    // Clean up
    await redis.del(testKey);
    
    // Test user authentication
    const authResult = await authenticateUser('admin@rame.com', 'admin123');
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection and authentication test successful',
      redisTest: result,
      authTest: authResult ? 'User authenticated' : 'User not found or invalid credentials'
    });
  } catch (error: any) {
    console.error('Redis connection failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Redis connection failed',
      error: error.message
    }, { status: 500 });
  }
}