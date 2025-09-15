import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    // Fetch all purchase orders from Redis
    const purchaseOrders = await redis.get('purchase_orders');
    
    if (!purchaseOrders) {
      // Return empty array if no data exists
      return NextResponse.json([]);
    }
    
    return NextResponse.json(purchaseOrders);
  } catch (error: any) {
    console.error('Error fetching purchase orders from Redis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Store purchase orders in Redis
    await redis.set('purchase_orders', JSON.stringify(data));
    
    return NextResponse.json({ success: true, message: 'Purchase orders saved successfully' });
  } catch (error: any) {
    console.error('Error saving purchase orders to Redis:', error);
    return NextResponse.json(
      { error: 'Failed to save purchase orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Update purchase orders in Redis
    await redis.set('purchase_orders', JSON.stringify(data));
    
    return NextResponse.json({ success: true, message: 'Purchase orders updated successfully' });
  } catch (error: any) {
    console.error('Error updating purchase orders in Redis:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase orders' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name, group } = await request.json();
    
    // Fetch current data
    const purchaseOrders = await redis.get('purchase_orders') as any[] || [];
    
    // Filter out the item to delete
    const updatedOrders = purchaseOrders.filter(
      (order: any) => !(order.name === name && order.group === group)
    );
    
    // Save updated data
    await redis.set('purchase_orders', JSON.stringify(updatedOrders));
    
    return NextResponse.json({ success: true, message: 'Purchase order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting purchase order from Redis:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase order' },
      { status: 500 }
    );
  }
}