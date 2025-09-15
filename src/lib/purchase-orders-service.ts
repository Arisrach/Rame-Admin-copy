import { PurchaseOrder, PurchaseOrderUIData } from './types';
import { prisma } from './db';

// UI representation that uses 'group' instead of 'group_name'
export interface PurchaseOrderUIData extends Omit<PurchaseOrder, 'group_name'> {
  group: string;
}

export class PurchaseOrdersService {
  static async getAll(): Promise<PurchaseOrder[]> {
    try {
      const orders = await prisma.purchaseOrder.findMany({
        orderBy: [
          { groupName: 'asc' },
          { name: 'asc' }
        ]
      });
      return orders;
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  static async create(order: PurchaseOrderUIData): Promise<PurchaseOrder> {
    try {
      // Convert UI data back to API format
      const apiOrder: any = {
        ...order,
        groupName: order.group,
        year: order.year || new Date().getFullYear()
      };
      delete apiOrder.group;

      const createdOrder = await prisma.purchaseOrder.create({
        data: apiOrder
      });

      return createdOrder;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  static async update(order: PurchaseOrderUIData, originalName?: string, originalGroup?: string): Promise<PurchaseOrder> {
    try {
      // Convert UI data back to API format
      const apiOrder: any = {
        ...order,
        groupName: order.group,
        year: order.year || new Date().getFullYear()
      };
      delete apiOrder.group;
      delete apiOrder.id; // Don't try to update the ID field
      delete apiOrder.originalName; // Remove originalName if present
      delete apiOrder.originalGroup; // Remove originalGroup if present

      let updatedOrder;

      if (originalName && originalGroup) {
        // Update with original name/group for cases where they were changed
        updatedOrder = await prisma.purchaseOrder.update({
          where: {
            name_groupName: {
              name: originalName,
              groupName: originalGroup
            }
          },
          data: apiOrder
        });
      } else {
        // Update by ID
        updatedOrder = await prisma.purchaseOrder.update({
          where: {
            id: order.id
          },
          data: apiOrder
        });
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  }

  static async delete(name: string, group: string): Promise<void> {
    try {
      await prisma.purchaseOrder.delete({
        where: {
          name_groupName: {
            name,
            groupName: group
          }
        }
      });
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  }
}