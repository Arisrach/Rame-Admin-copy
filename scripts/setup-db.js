const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Create default admin user
    const defaultEmail = 'admin@rame.com';
    const defaultPassword = 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: defaultEmail }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        isActive: true,
      },
    });
    
    console.log('✅ Database setup completed!');
    console.log('📧 Default admin credentials:');
    console.log(`   Email: ${defaultEmail}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
