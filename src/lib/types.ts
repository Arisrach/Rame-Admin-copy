export interface PurchaseOrder {
  id: number;
  name: string;
  groupName: string;
  januari: bigint | number;
  februari: bigint | number;
  maret: bigint | number;
  april: bigint | number;
  mei: bigint | number;
  juni: bigint | number;
  juli: bigint | number;
  agustus: bigint | number;
  september: bigint | number;
  oktober: bigint | number;
  november: bigint | number;
  desember: bigint | number;
  totalQtyPO: number;
  totalValueSales: bigint | number;
  targetGroup: bigint | number | null;
  achieve: bigint | number | null;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// UI representation that uses 'group' instead of 'group_name'
export interface PurchaseOrderUIData extends Omit<PurchaseOrder, 'groupName'> {
  group: string;
}

export interface Admin {
  id: number;
  email: string;
  password: string;
  name: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}