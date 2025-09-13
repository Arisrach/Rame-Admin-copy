const mysql = require('mysql2/promise');

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rame_admin'
};

const sampleData = [
  // Group A
  { name: "Agus Suryano", group_name: "A" },
  { name: "TH Waryana", group_name: "A" },
  { name: "Okta Paulina", group_name: "A" },
  { name: "Ainayya Alfatimah", group_name: "A" },
  { name: "Sinta", group_name: "A" },
  
  // Group D
  { name: "Adib Abdillah", group_name: "D" },
  { name: "Hulia", group_name: "D" },
  { name: "Masnoivo", group_name: "D" },
  { name: "Khedri Rohim", group_name: "D" },
  { name: "Imam Adshar", group_name: "D" },
  
  // Group C
  { name: "Andy Kumiawan", group_name: "C" },
  { name: "Raines / Seren", group_name: "C" },
  
  // Group B
  { name: "Ponco Pamungkas", group_name: "B" },
  { name: "Agung Hilal", group_name: "B" },
  { name: "Umi Malamah", group_name: "B" },
  { name: "Sudirman", group_name: "B" },
  
  // Other Group
  { name: "Egi Restu", group_name: "Other" },
  { name: "Lulu Prativi", group_name: "Other" },
  { name: "Wulandari", group_name: "Other" },
  { name: "Sapiyan", group_name: "Other" },
  { name: "Yoga Alamsyah", group_name: "Other" },
];

async function seedPurchaseOrders() {
  let connection;
  
  try {
    console.log('🌱 Seeding purchase orders data...');
    
    connection = await mysql.createConnection(connectionConfig);
    
    // Clear existing data
    await connection.execute('DELETE FROM purchase_orders');
    
    // Insert sample data
    for (const data of sampleData) {
      await connection.execute(
        `INSERT INTO purchase_orders (name, group_name, year) VALUES (?, ?, ?)`,
        [data.name, data.group_name, 2025]
      );
    }
    
    console.log('✅ Purchase orders data seeded successfully!');
    console.log(`📊 Inserted ${sampleData.length} records`);
    
  } catch (error) {
    console.error('❌ Error seeding purchase orders:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedPurchaseOrders();
