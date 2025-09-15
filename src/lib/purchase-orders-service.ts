export interface PurchaseOrder {
  id?: number;
  name: string;
  group_name: string;
  januari: number;
  februari: number;
  maret: number;
  april: number;
  mei: number;
  juni: number;
  juli: number;
  agustus: number;
  september: number;
  oktober: number;
  november: number;
  desember: number;
  totalQtyPO: number;
  totalValueSales: number;
  targetGroup?: number;
  achieve?: number;
  year?: number;
}

// UI representation that uses 'group' instead of 'group_name'
export interface PurchaseOrderUIData extends Omit<PurchaseOrder, 'group_name'> {
  group: string;
}

export class PurchaseOrdersService {
  static async getAll(): Promise<PurchaseOrder[]> {
    try {
      const response = await fetch('/api/purchase-orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched purchase orders:', data);
      return data;
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  static async create(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Created purchase order:', data);
      return data;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  static async update(order: PurchaseOrderUIData, originalName?: string, originalGroup?: string): Promise<PurchaseOrder> {
    try {
      // Convert UI format to database format
      const dbOrder: PurchaseOrder = {
        id: order.id,
        name: order.name,
        group_name: order.group,
        januari: order.januari,
        februari: order.februari,
        maret: order.maret,
        april: order.april,
        mei: order.mei,
        juni: order.juni,
        juli: order.juli,
        agustus: order.agustus,
        september: order.september,
        oktober: order.oktober,
        november: order.november,
        desember: order.desember,
        totalQtyPO: order.totalQtyPO,
        totalValueSales: order.totalValueSales,
        targetGroup: order.targetGroup,
        achieve: order.achieve,
        year: order.year
      };
      
      const requestBody: any = {
        ...dbOrder,
        originalName: originalName || order.name,
        originalGroup: originalGroup || order.group
      };
      
      console.log('=== SENDING REQUEST TO API ===');
      console.log('API Endpoint: /api/purchase-orders');
      console.log('Request Method: POST');
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response OK:', response.ok);
      console.log('API Response Headers:', [...response.headers.entries()]);
      
      // Log the raw response text
      const responseText = await response.text();
      console.log('API Response Text:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError);
        throw new Error(`Failed to parse API response: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      console.log('API Success Response:', data);
      return { ...data, status: response.status };
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  }

  static async delete(name: string, group_name: string): Promise<void> {
    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, group_name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Deleted purchase order:', data);
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  }

  static async updateTargetGroup(group_name: string, targetGroup: number): Promise<void> {
    try {
      // This would need a specific endpoint or we can use the update method for all members
      console.log('Updating target group:', { group_name, targetGroup });
    } catch (error) {
      console.error('Error updating target group:', error);
      throw error;
    }
  }
}