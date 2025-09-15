import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rame_admin'
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
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    console.log('=== POST REQUEST RECEIVED ===');
    console.log('Raw request data:', JSON.stringify(data, null, 2));
    
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
      year = 2025,
      originalName,
      originalGroup
    } = data;
    
    console.log('Extracted data:', {
      name,
      group_name,
      originalName,
      originalGroup,
      hasOriginal: !!(originalName && originalGroup),
      isNameChange: originalName && originalGroup && (originalName !== name || originalGroup !== group_name)
    });
    
    connection = await mysql.createConnection(connectionConfig);
    
    // For updates with original values, we update the record that actually exists
    if (originalName && originalGroup) {
      console.log('=== UPDATING EXISTING RECORD ===');
      console.log('Looking for record with:', { originalName, originalGroup });
      console.log('Want to update to:', { newName: name, newGroup: group_name });
      
      // First, check if the ORIGINAL record exists (this is what we're actually updating)
      const [originalRows]: any = await connection.execute(
        'SELECT * FROM purchase_orders WHERE name = ? AND group_name = ?',
        [originalName, originalGroup]
      );
      console.log('Original record check result:', originalRows);
      console.log('Original record exists:', originalRows.length > 0);
      
      if (originalRows.length > 0) {
        console.log('Updating existing record with new values');
        // Update the existing record with ALL new values including potentially new name/group
        const result: any = await connection.execute(
          `UPDATE purchase_orders SET 
           name = ?, group_name = ?, januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
           juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
           november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?, year = ?
           WHERE name = ? AND group_name = ?`,
          [
            name, group_name, januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup, year,
            originalName, originalGroup
          ]
        );
        console.log('Update result:', result);
        console.log('Affected rows:', result[0]?.affectedRows);
        console.log('Changed rows:', result[0]?.changedRows);
      } else {
        console.log('ERROR: Original record not found!');
        // This is the key fix - if the original record doesn't exist, 
        // we need to find the actual record and update it
        console.log('Looking for actual record with name only:', originalName);
        const [actualRows]: any = await connection.execute(
          'SELECT * FROM purchase_orders WHERE name = ?',
          [originalName]
        );
        console.log('Actual records found:', actualRows);
        
        if (actualRows.length > 0) {
          const actualRecord = actualRows[0];
          console.log('Found actual record:', {
            name: actualRecord.name,
            group_name: actualRecord.group_name
          });
          
          // Update the actual record with the new values
          console.log('Updating actual record with new values');
          const result: any = await connection.execute(
            `UPDATE purchase_orders SET 
             name = ?, group_name = ?, januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
             juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
             november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?, year = ?
             WHERE name = ? AND group_name = ?`,
            [
              name, group_name, januari, februari, maret, april, mei,
              juni, juli, agustus, september, oktober,
              november, desember, totalQtyPO, totalValueSales, targetGroup, year,
              actualRecord.name, actualRecord.group_name
            ]
          );
          console.log('Update result:', result);
          console.log('Affected rows:', result[0]?.affectedRows);
          console.log('Changed rows:', result[0]?.changedRows);
        } else {
          console.log('ERROR: No records found for this person at all!');
          // If no records exist, insert a new one
          console.log('Inserting new record');
          const result: any = await connection.execute(
            `INSERT INTO purchase_orders 
             (name, group_name, januari, februari, maret, april, mei, 
              juni, juli, agustus, september, oktober, 
              november, desember, totalQtyPO, totalValueSales, targetGroup, year) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              name, group_name, januari, februari, maret, april, mei,
              juni, juli, agustus, september, oktober,
              november, desember, totalQtyPO, totalValueSales, targetGroup, year
            ]
          );
          console.log('Insert result:', result);
        }
      }
    } else {
      console.log('=== INSERTING NEW RECORD ===');
      // Insert new record
      const [existingRows] = await connection.execute(
        'SELECT * FROM purchase_orders WHERE name = ? AND group_name = ?',
        [name, group_name]
      );
      console.log('Existing rows found:', (existingRows as any[]).length);
      
      if ((existingRows as any[]).length > 0) {
        console.log('Record exists, updating');
        // Regular update
        const result = await connection.execute(
          `UPDATE purchase_orders SET 
           januari = ?, februari = ?, maret = ?, april = ?, mei = ?, 
           juni = ?, juli = ?, agustus = ?, september = ?, oktober = ?, 
           november = ?, desember = ?, totalQtyPO = ?, totalValueSales = ?, targetGroup = ?, year = ?
           WHERE name = ? AND group_name = ?`,
          [
            januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup, year,
            name, group_name
          ]
        );
        console.log('Update result:', result);
      } else {
        console.log('Record does not exist, inserting new record');
        // Insert new record
        const result = await connection.execute(
          `INSERT INTO purchase_orders 
           (name, group_name, januari, februari, maret, april, mei, 
            juni, juli, agustus, september, oktober, 
            november, desember, totalQtyPO, totalValueSales, targetGroup, year) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name, group_name, januari, februari, maret, april, mei,
            juni, juli, agustus, september, oktober,
            november, desember, totalQtyPO, totalValueSales, targetGroup, year
          ]
        );
        console.log('Insert result:', result);
      }
    }
    
    await connection.end();
    console.log('=== REQUEST COMPLETED SUCCESSFULLY ===');
    
    return NextResponse.json({ message: 'Purchase order saved successfully' });
  } catch (error: any) {
    console.error('=== ERROR IN POST REQUEST ===');
    console.error('Error saving purchase order:', error);
    
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

// Endpoint khusus untuk update totalQtyPO saja
export async function PATCH(request: NextRequest) {
  let connection;
  try {
    const data = await request.json();
    connection = await mysql.createConnection(connectionConfig);
    
    const { name, group_name, totalQtyPO } = data;
    
    if (!name || !group_name || totalQtyPO === undefined) {
      return NextResponse.json(
        { error: 'Name, group_name, and totalQtyPO are required' },
        { status: 400 }
      );
    }
    
    // Update hanya totalQtyPO
    const [result] = await connection.execute(
      'UPDATE purchase_orders SET totalQtyPO = ? WHERE name = ? AND group_name = ?',
      [totalQtyPO, name, group_name]
    );
    
    await connection.end();
    
    if ((result as any).affectedRows > 0) {
      return NextResponse.json({ message: 'Total Qty PO updated successfully' });
    } else {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error updating total Qty PO:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update total Qty PO', details: error.message },
      { status: 500 }
    );
  }
}