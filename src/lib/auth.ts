import bcrypt from 'bcryptjs';
import { prisma } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
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
    
    const user = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}