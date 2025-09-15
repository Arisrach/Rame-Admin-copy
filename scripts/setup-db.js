const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful!');
    
    // Try to create tables manually
    console.log('Creating tables...');
    
    // Create admins table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        isActive BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Admins table created or already exists');
    
    // Create purchase_orders table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`group\` VARCHAR(50) NOT NULL,
        januari FLOAT DEFAULT 0,
        februari FLOAT DEFAULT 0,
        maret FLOAT DEFAULT 0,
        april FLOAT DEFAULT 0,
        mei FLOAT DEFAULT 0,
        juni FLOAT DEFAULT 0,
        juli FLOAT DEFAULT 0,
        agustus FLOAT DEFAULT 0,
        september FLOAT DEFAULT 0,
        oktober FLOAT DEFAULT 0,
        november FLOAT DEFAULT 0,
        desember FLOAT DEFAULT 0,
        totalQtyPO INT DEFAULT 0,
        totalValueSales FLOAT DEFAULT 0,
        targetGroup FLOAT,
        achieve FLOAT,
        year INT DEFAULT 2025,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_name_group (name, \`group\`)
      )
    `;
    console.log('✅ Purchase orders table created or already exists');
    
    // Create a default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Check if admin user already exists
    const existingAdmin = await prisma.$queryRaw`
      SELECT * FROM admins WHERE email = 'admin@rame.com' LIMIT 1
    `;
    
    if (existingAdmin.length === 0) {
      await prisma.$executeRaw`
        INSERT INTO admins (email, password, name) 
        VALUES ('admin@rame.com', '${hashedPassword}', 'Admin User')
      `;
      console.log('✅ Default admin user created');
    } else {
      console.log('✅ Default admin user already exists');
    }
    
    await prisma.$disconnect();
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();