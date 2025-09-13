import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rame_admin'
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM purchase_orders ORDER BY group_name, name'
    );
    
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const connection = await mysql.createConnection(connectionConfig);
    
    const {
      name,
      group_name,
      januari,
      februari,
      maret,
      april,
      mei,
      juni,
      juli,
      agustus,
      september,
      oktober,
      november,
      desember,
      totalQtyPO,
      totalValueSales,
      targetGroup,
      originalName,
      originalGroup
    } = data;
    
    // Check if this is a name or group change
    if (originalName && originalGroup && (originalName !== name || originalGroup !== group_name)) {
      // First, check if a record with the new name and group already exists
      const [existingRows] = await connection.execute(
        'SELECT * FROM purchase_orders WHERE name = ? AND group_name = ?',
        [name, group_name]
      );
      
      if ((existingRows as any[]).length > 0) {
        // Update existing record
        await connection.execute(
          `UPDATE purchase_orders SET 
           januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
           juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
           november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?
           WHERE name = ? AND group_name = ?`,
          [
            januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup,
            name, group_name
          ]
        );
        
        // Delete the old record
        await connection.execute(
          'DELETE FROM purchase_orders WHERE name = ? AND group_name = ?',
          [originalName, originalGroup]
        );
      } else {
        // Update the existing record with new name/group
        await connection.execute(
          `UPDATE purchase_orders SET 
           name = ?, group_name = ?, januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
           juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
           november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?
           WHERE name = ? AND group_name = ?`,
          [
            name, group_name, januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup,
            originalName, originalGroup
          ]
        );
      }
    } else {
      // Regular update
      await connection.execute(
        `UPDATE purchase_orders SET 
         januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
         juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
         november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?
         WHERE name = ? AND group_name = ?`,
        [
          januari, februari, maret, april, mei,
          juni, juli, agustus, september, oktober,
          november, desember, totalQtyPO, totalValueSales, targetGroup,
          name, group_name
        ]
      );
    }
    
    await connection.end();
    
    return NextResponse.json({ message: 'Purchase order updated successfully' });
  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase order' },
      { status: 500 }
    );
  }
}
