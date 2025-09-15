import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    // Test Redis connection by setting and getting a value
    const testKey = 'test_connection';
    const testValue = 'success';
    
    await redis.set(testKey, testValue);
    const result = await redis.get(testKey);
    
    // Clean up
    await redis.del(testKey);
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection successful',
      result
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