import { Redis } from '@upstash/redis'

// Handle both rediss:// and https:// URLs
const redisUrl = process.env.REDIS_URL || 'http://localhost:6379';
const redisToken = process.env.REDIS_TOKEN || 'your-token';

// Validate that we have the required environment variables
if (!process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
  console.warn('REDIS_URL is not set. Using default URL which may not work in production.');
}

if (!process.env.REDIS_TOKEN && process.env.NODE_ENV === 'production') {
  console.warn('REDIS_TOKEN is not set. Using default token which may not work in production.');
}

const normalizedUrl = redisUrl.startsWith('rediss://') 
  ? redisUrl.replace('rediss://', 'https://') 
  : redisUrl;

const redis = new Redis({
  url: normalizedUrl,
  token: redisToken,
})

export default redis