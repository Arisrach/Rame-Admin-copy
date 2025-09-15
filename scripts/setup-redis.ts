import redis from '../src/lib/redis';

// Sample purchase order data
const sampleData = [
  // Group A
  { id: 1, name: "Agus Suryano", group_name: "A", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 40000000000, achieve: 0, year: 2025 },
  { id: 2, name: "TH Waryana", group_name: "A", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 40000000000, achieve: 0, year: 2025 },
  { id: 3, name: "Okta Paulina", group_name: "A", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 40000000000, achieve: 0, year: 2025 },
  { id: 4, name: "Ainayya Alfatimah", group_name: "A", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 40000000000, achieve: 0, year: 2025 },
  { id: 5, name: "Sinta", group_name: "A", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 40000000000, achieve: 0, year: 2025 },
  
  // Group D
  { id: 6, name: "Adib Abdillah", group_name: "D", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 7, name: "Hulia", group_name: "D", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 8, name: "Masnoivo", group_name: "D", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 9, name: "Khedri Rohim", group_name: "D", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 10, name: "Imam Adshar", group_name: "D", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  
  // Group C
  { id: 11, name: "Andy Kumiawan", group_name: "C", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 15000000000, achieve: 0, year: 2025 },
  { id: 12, name: "Raines / Seren", group_name: "C", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 15000000000, achieve: 0, year: 2025 },
  
  // Group B
  { id: 13, name: "Ponco Pamungkas", group_name: "B", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 14, name: "Agung Hilal", group_name: "B", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 15, name: "Umi Malamah", group_name: "B", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  { id: 16, name: "Sudirman", group_name: "B", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 20000000000, achieve: 0, year: 2025 },
  
  // Other Group
  { id: 17, name: "Egi Restu", group_name: "Other", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 0, achieve: 0, year: 2025 },
  { id: 18, name: "Lulu Prativi", group_name: "Other", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 0, achieve: 0, year: 2025 },
  { id: 19, name: "Wulandari", group_name: "Other", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 0, achieve: 0, year: 2025 },
  { id: 20, name: "Sapiyan", group_name: "Other", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 0, achieve: 0, year: 2025 },
  { id: 21, name: "Yoga Alamsyah", group_name: "Other", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, targetGroup: 0, achieve: 0, year: 2025 },
];

async function setupRedis() {
  try {
    console.log('Setting up Redis with sample data...');
    
    // Store sample purchase orders
    await redis.set('purchase_orders', JSON.stringify(sampleData));
    console.log('Sample purchase orders stored in Redis');
    
    // Create a sample admin user
    const adminUser = {
      email: 'admin@example.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', // password: admin123
      name: 'Admin User',
      isActive: true,
      id: 1
    };
    
    await redis.set('user:admin@example.com', JSON.stringify(adminUser));
    console.log('Sample admin user created');
    
    console.log('Redis setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Redis:', error);
  }
}

setupRedis();