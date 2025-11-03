const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful!');
    
    // Try to get purchase orders with the new schema
    console.log('Testing fetch purchase orders...');
    const orders = await prisma.purchaseOrder.findMany();
    console.log('✅ Retrieved purchase orders:', orders.length);
    
    if (orders.length > 0) {
      console.log('Sample order:', orders[0]);
      console.log('Sample januari value type:', typeof orders[0].januari, 'value:', orders[0].januari);
      console.log('Sample totalValueSales value type:', typeof orders[0].totalValueSales, 'value:', orders[0].totalValueSales);
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database or fetching data:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();