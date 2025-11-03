const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateFloatToBigInt() {
  try {
    console.log('Starting migration: Float to BigInt conversion');
    
    // Check if the purchase_orders table exists
    await prisma.$queryRaw`SELECT 1 FROM purchase_orders LIMIT 1`;
    console.log('✅ purchase_orders table exists');
    
    // Define the columns that need to be changed from FLOAT to BIGINT
    const columnsToChange = [
      'januari', 'februari', 'maret', 'april', 'mei', 'juni', 
      'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
      'totalValueSales', 'targetGroup', 'achieve'
    ];
    
    console.log('Converting FLOAT columns to BIGINT...');
    
    // First, backup existing data to temporary columns
    for (const column of columnsToChange) {
      console.log(`  Processing column: ${column}`);
      
      // Add temporary BIGINT column
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE purchase_orders ADD COLUMN temp_${column} BIGINT DEFAULT 0;`);
      } catch (e) {
        // Column might already exist from a previous attempt, continue
        console.log(`    Warning: temp_${column} might already exist, continuing...`);
      }
      
      // Copy data from old column to new column, converting to integer (rounding)
      // We need to handle potential NULL values
      if (['targetGroup', 'achieve'].includes(column)) {
        // For nullable columns
        await prisma.$executeRawUnsafe(`
          UPDATE purchase_orders 
          SET temp_${column} = CASE 
            WHEN ${column} IS NOT NULL THEN CAST(ROUND(${column}) AS SIGNED)
            ELSE NULL 
          END;
        `);
      } else {
        // For non-nullable columns
        await prisma.$executeRawUnsafe(`
          UPDATE purchase_orders 
          SET temp_${column} = CAST(ROUND(COALESCE(${column}, 0)) AS SIGNED);
        `);
      }
    }
    
    console.log('✅ Data copied successfully to temporary columns');
    
    // Drop the original FLOAT columns and rename the BIGINT columns
    for (const column of columnsToChange) {
      await prisma.$executeRawUnsafe(`ALTER TABLE purchase_orders DROP COLUMN ${column};`);
      await prisma.$executeRawUnsafe(`ALTER TABLE purchase_orders CHANGE temp_${column} ${column} BIGINT${['targetGroup', 'achieve'].includes(column) ? '' : ' NOT NULL DEFAULT 0'};`);
    }
    
    console.log('✅ All columns have been converted to BIGINT');
    
    // Verify the changes
    console.log('Verifying changes...');
    const columns = await prisma.$queryRaw`SHOW COLUMNS FROM purchase_orders`;
    const numericColumns = columnsToChange.map(col => col.toLowerCase());
    
    for (const col of columns) {
      if (numericColumns.includes(col.Field.toLowerCase())) {
        console.log(`  ${col.Field}: ${col.Type}`);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateFloatToBigInt().catch(e => {
  console.error('Error during migration:', e);
  process.exit(1);
});