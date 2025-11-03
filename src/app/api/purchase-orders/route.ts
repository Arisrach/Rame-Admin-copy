import { NextRequest, NextResponse } from 'next/server';
import { PurchaseOrdersService } from '@/lib/purchase-orders-service';

// Helper function to serialize BigInt values for JSON
function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      // Check if the BigInt value is within the safe integer range for JavaScript
      const numValue = Number(value);
      if (Number.isSafeInteger(numValue)) {
        return numValue;
      } else {
        // For very large BigInt values, return as string
        return value.toString();
      }
    }
    return value;
  }));
}

export async function GET() {
  try {
    const orders = await PurchaseOrdersService.getAll();
    // Serialize BigInt values for JSON response
    return NextResponse.json(serializeBigInt(orders));
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
    // Serialize BigInt values for JSON response
    return NextResponse.json(serializeBigInt(order));
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
    // Serialize BigInt values for JSON response
    return NextResponse.json(serializeBigInt(order));
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