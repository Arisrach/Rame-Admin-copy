import { NextRequest, NextResponse } from 'next/server';
import { PurchaseOrdersService } from '@/lib/purchase-orders-service';

export async function DELETE(request: NextRequest) {
  try {
    const { group } = await request.json();
    
    // Don't allow deletion of the default groups
    const defaultGroups = ['A', 'B', 'C', 'D', 'Other'];
    if (defaultGroups.includes(group)) {
      return NextResponse.json(
        { error: 'Cannot delete default groups' },
        { status: 400 }
      );
    }
    
    // Delete all purchase orders in the group
    await PurchaseOrdersService.deleteGroup(group);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const groups = await PurchaseOrdersService.getAllGroupNames();
    return NextResponse.json(groups);
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}