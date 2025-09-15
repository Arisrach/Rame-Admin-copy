import { NextRequest, NextResponse } from 'next/server';
import { PurchaseOrdersService } from '@/lib/purchase-orders-service';

export async function GET() {
  try {
    const orders = await PurchaseOrdersService.getAll();
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
    const order = await PurchaseOrdersService.create(data);
    return NextResponse.json(order);
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
    const order = await PurchaseOrdersService.update(data);
    return NextResponse.json(order);
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
    const { name, group } = await request.json();
    await PurchaseOrdersService.delete(name, group);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase order' },
      { status: 500 }
    );
  }
}