export interface PurchaseOrder {
  id: number;
  name: string;
  groupName: string;
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
  targetGroup: number | null;
  achieve: number | null;
  year: number;
  createdAt: Date;
  updatedAt: Date;
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