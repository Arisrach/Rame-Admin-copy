import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const dataFilePath = join(process.cwd(), 'data', 'purchase-orders.json');

// Helper function to read data from JSON file
async function readData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

// Helper function to write data to JSON file
async function writeData(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

export async function GET() {
  try {
    const orders = await readData();
    return NextResponse.json(orders);
  } catch (error: any) {
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
    const orders = await readData();
    
    // Generate a new ID (find the max ID and add 1)
    const maxId = orders.length > 0 ? Math.max(...orders.map((o: any) => o.id)) : 0;
    const newId = maxId + 1;
    
    // Add the new order with the generated ID
    const newOrder = {
      id: newId,
      ...data,
      year: data.year || new Date().getFullYear()
    };
    
    orders.push(newOrder);
    
    const success = await writeData(orders);
    if (success) {
      return NextResponse.json(newOrder);
    } else {
      return NextResponse.json(
        { error: 'Failed to save purchase order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const orders = await readData();
    
    // Find the index of the order to update
    const index = orders.findIndex((order: any) => order.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }
    
    // Update the order
    orders[index] = {
      ...orders[index],
      ...data,
      year: data.year || new Date().getFullYear()
    };
    
    const success = await writeData(orders);
    if (success) {
      return NextResponse.json(orders[index]);
    } else {
      return NextResponse.json(
        { error: 'Failed to update purchase order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const orders = await readData();
    
    // Filter out the order to delete
    const newOrders = orders.filter((order: any) => order.id !== id);
    
    if (newOrders.length === orders.length) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }
    
    const success = await writeData(newOrders);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete purchase order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error deleting purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase order' },
      { status: 500 }
    );
  }
}