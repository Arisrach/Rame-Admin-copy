import { PurchaseOrder, PurchaseOrderUIData } from './types';
import redis from '@/lib/redis';

// UI representation that uses 'group' instead of 'group_name'
export interface PurchaseOrderUIData extends Omit<PurchaseOrder, 'group_name'> {
  group: string;
}

export class PurchaseOrdersService {
  static async getAll(): Promise<PurchaseOrder[]> {
    try {
      const data = await redis.get('purchase_orders');
      if (!data) {
        return [];
      }
      return JSON.parse(data as string);
    } catch (error) {
      console.error('Error fetching purchase orders from Redis:', error);
      return [];
    }
  }

  static async create(order: PurchaseOrderUIData): Promise<PurchaseOrder> {
    try {
      // Convert UI data back to API format
      const apiOrder: PurchaseOrder = {
        ...order,
        group_name: order.group,
        year: order.year || new Date().getFullYear()
      };
      delete (apiOrder as any).group;

      const orders = await this.getAll();
      orders.push(apiOrder);

      await redis.set('purchase_orders', JSON.stringify(orders));

      return apiOrder;
    } catch (error) {
      console.error('Error creating purchase order in Redis:', error);
      throw error;
    }
  }

  static async update(order: PurchaseOrderUIData, originalName?: string, originalGroup?: string): Promise<PurchaseOrder> {
    try {
      // Convert UI data back to API format
      const apiOrder: PurchaseOrder = {
        ...order,
        group_name: order.group,
        year: order.year || new Date().getFullYear()
      };
      delete (apiOrder as any).group;

      const orders = await this.getAll();
      
      if (originalName && originalGroup) {
        // Find and replace the specific order
        const index = orders.findIndex(
          (o: PurchaseOrder) => o.name === originalName && o.group_name === originalGroup
        );
        
        if (index !== -1) {
          orders[index] = apiOrder;
        } else {
          orders.push(apiOrder);
        }
      } else {
        // Find by ID or current values
        const index = orders.findIndex(
          (o: PurchaseOrder) => o.id === order.id || 
          (o.name === order.name && o.group_name === order.group)
        );
        
        if (index !== -1) {
          orders[index] = apiOrder;
        } else {
          orders.push(apiOrder);
        }
      }

      await redis.set('purchase_orders', JSON.stringify(orders));

      return apiOrder;
    } catch (error) {
      console.error('Error updating purchase order in Redis:', error);
      throw error;
    }
  }

  static async delete(name: string, group: string): Promise<void> {
    try {
      const orders = await this.getAll();
      const filteredOrders = orders.filter(
        (order: PurchaseOrder) => !(order.name === name && order.group_name === group)
      );

      await redis.set('purchase_orders', JSON.stringify(filteredOrders));
    } catch (error) {
      console.error('Error deleting purchase order from Redis:', error);
      throw error;
    }
  }
}