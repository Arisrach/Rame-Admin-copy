import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rame_admin'
};

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM purchase_orders ORDER BY group_name, name'
    );
    
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching purchase orders:', error);
    
    // Close connection if it exists
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    // Return empty array as fallback instead of error object
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    connection = await mysql.createConnection(connectionConfig);
    
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
      // Check if record already exists
      const [existingRows] = await connection.execute(
        'SELECT * FROM purchase_orders WHERE name = ? AND group_name = ?',
        [name, group_name]
      );
      
      if ((existingRows as any[]).length > 0) {
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
      } else {
        // Insert new record
        await connection.execute(
          `INSERT INTO purchase_orders 
           (name, group_name, januari, februari, maret, april, mei, 
            juni, juli, agustus, september, oktober, 
            november, desember, totalQtyPO, totalValueSales, targetGroup) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name, group_name, januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup
          ]
        );
      }
    }
    
    await connection.end();
    
    return NextResponse.json({ message: 'Purchase order saved successfully' });
  } catch (error: any) {
    console.error('Error saving purchase order:', error);
    
    // Close connection if it exists
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to save purchase order', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    connection = await mysql.createConnection(connectionConfig);
    
    const { name, group_name } = data;
    
    // Delete the record
    const [result] = await connection.execute(
      'DELETE FROM purchase_orders WHERE name = ? AND group_name = ?',
      [name, group_name]
    );
    
    await connection.end();
    
    // Check if any rows were affected
    if ((result as any).affectedRows > 0) {
      return NextResponse.json({ message: 'Purchase order deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error deleting purchase order:', error);
    
    // Close connection if it exists
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete purchase order', details: error.message },
      { status: 500 }
    );
  }
}
