import bcrypt from 'bcryptjs';
import redis from './redis';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Fetch user from Redis
    const userData = await redis.get(`user:${email}`);
    
    if (!userData) {
      return null;
    }
    
    const user = JSON.parse(userData as string);
    
    if (!user.isActive) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createAdminUser(email: string, password: string, name?: string) {
  try {
    const hashedPassword = await hashPassword(password);
    
    const user = {
      email,
      password: hashedPassword,
      name,
      isActive: true,
      id: Date.now(), // Simple ID generation
    };
    
    // Store user in Redis
    await redis.set(`user:${email}`, JSON.stringify(user));

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}
