"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from '@/components/ui/chart';
import { PurchaseOrdersService } from '@/lib/purchase-orders-service';
import { PurchaseOrder } from '@/lib/types';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Processing your request...</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please wait</p>
    </div>
  </div>
);

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PurchaseOrderData {
  no: number;
  name: string;
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
  group: string;
  targetGroup?: number;
  achieve?: number;
  id?: number;
}

const sampleData: PurchaseOrderData[] = [
  // Group A
  { no: 1, name: "Agus Suryano", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "A", targetGroup: 40000000000 },
  { no: 2, name: "TH Waryana", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "A", targetGroup: 40000000000 },
  { no: 3, name: "Okta Paulina", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "A", targetGroup: 40000000000 },
  { no: 4, name: "Ainayya Alfatimah", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "A", targetGroup: 40000000000 },
  { no: 5, name: "Sinta", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "A", targetGroup: 40000000000 },
  
  // Group D
  { no: 1, name: "Adib Abdillah", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "D", targetGroup: 20000000000 },
  { no: 2, name: "Hulia", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "D", targetGroup: 20000000000 },
  { no: 3, name: "Masnoivo", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "D", targetGroup: 20000000000 },
  { no: 4, name: "Khedri Rohim", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "D", targetGroup: 20000000000 },
  { no: 5, name: "Imam Adshar", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "D", targetGroup: 20000000000 },
  
  // Group C
  { no: 1, name: "Andy Kumiawan", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "C", targetGroup: 15000000000 },
  { no: 2, name: "Raines / Seren", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "C", targetGroup: 15000000000 },
  
  // Group B
  { no: 1, name: "Ponco Pamungkas", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "B", targetGroup: 20000000000 },
  { no: 2, name: "Agung Hilal", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "B", targetGroup: 20000000000 },
  { no: 3, name: "Umi Malamah", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "B", targetGroup: 20000000000 },
  { no: 4, name: "Sudirman", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "B", targetGroup: 20000000000 },
  
  // Other Group
  { no: 1, name: "Egi Restu", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "Other", targetGroup: 0 },
  { no: 2, name: "Lulu Prativi", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "Other", targetGroup: 0 },
  { no: 3, name: "Wulandari", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "Other", targetGroup: 0 },
  { no: 4, name: "Sapiyan", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "Other", targetGroup: 0 },
  { no: 5, name: "Yoga Alamsyah", januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0, totalQtyPO: 0, totalValueSales: 0, group: "Other", targetGroup: 0 },
];

export default function DashboardPage() {
  const [data, setData] = useState<PurchaseOrderData[]>([]);
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [originalValues, setOriginalValues] = useState<{name: string, group: string} | null>(null);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [targetEditValue, setTargetEditValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [crudLoading, setCrudLoading] = useState(false); // New state for CRUD operations
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupTarget, setNewGroupTarget] = useState(0);
  const [availableGroups, setAvailableGroups] = useState<string[]>(['A', 'B', 'C', 'D', 'Other']);
  const [groupTargets, setGroupTargets] = useState<{[key: string]: number}>({
    'A': 40000000000,
    'B': 20000000000,
    'C': 15000000000,
    'D': 20000000000,
    'Other': 0
  });

  // Chart configurations
  const monthlyChartConfig = {
    total: {
      label: "Total Sales",
      color: "#f97316", // Orange color
    },
  } satisfies ChartConfig;


  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const result = await PurchaseOrdersService.getAll();
      console.log('=== FETCH PURCHASE ORDERS ===');
      console.log('Raw API response:', result);
      
      // Transform database data to match our interface
      const transformedData = result.map((item: any, index: number) => ({
        id: item.id,
        no: index + 1,
        name: item.name,
        januari: item.januari || 0,
        februari: item.februari || 0,
        maret: item.maret || 0,
        april: item.april || 0,
        mei: item.mei || 0,
        juni: item.juni || 0,
        juli: item.juli || 0,
        agustus: item.agustus || 0,
        september: item.september || 0,
        oktober: item.oktober || 0,
        november: item.november || 0,
        desember: item.desember || 0,
        totalQtyPO: item.totalQtyPO || 0,
        totalValueSales: item.totalValueSales || 0,
        group: item.group_name,
        targetGroup: item.targetGroup || 0,
        achieve: item.achieve || 0
      }));
      console.log('Transformed data:', transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      // Fallback to sample data
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handleDeletePerson = async (rowIndex: number) => {
    const personToDelete = data[rowIndex];
    
    // Confirmation
    if (!confirm(`Apakah Anda yakin ingin menghapus ${personToDelete.name}?`)) {
      return;
    }
    
    // Delete from database first
    try {
      setCrudLoading(true); // Start loading indicator
      await PurchaseOrdersService.delete(personToDelete.name, personToDelete.group);
      
      // Remove from UI only if database delete is successful
      const newData = data.filter((_, index) => index !== rowIndex);
      // Update row numbers
      const updatedData = newData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData(updatedData);
    } catch (error: any) {
      console.error('Error deleting person:', error);
      alert(`Terjadi kesalahan saat menghapus person: ${error.message || 'Silakan coba lagi.'}`);
    } finally {
      setCrudLoading(false); // Stop loading indicator
    }
  };

  const handleAddPerson = async () => {
    const newPerson: PurchaseOrderData = {
      no: data.length + 1,
      name: "New Person",
      januari: 0,
      februari: 0,
      maret: 0,
      april: 0,
      mei: 0,
      juni: 0,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      totalQtyPO: 0,
      totalValueSales: 0,
      group: "Other",
      targetGroup: 0
    };
    
    // Save to database first
    try {
      setCrudLoading(true); // Start loading indicator
      await PurchaseOrdersService.create(newPerson);
      
      // Add to UI only if database save is successful
      const newData = [...data, newPerson];
      setData(newData);
    } catch (error: any) {
      console.error('Error saving person:', error);
      alert(`Terjadi kesalahan saat menambahkan person: ${error.message || 'Silakan coba lagi.'}`);
    } finally {
      setCrudLoading(false); // Stop loading indicator
    }
  };

  const handleCellEdit = (rowIndex: number, column: string, currentValue: number | string) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(currentValue.toString());
  };

  const handleCellSave = async () => {
    console.log('handleCellSave called with editingCell:', editingCell);
    console.log('editValue:', editValue);
    if (editingCell) {
      const newData = [...data];
      
      if (editingCell.col === 'name') {
        // Handle name editing
        newData[editingCell.row].name = editValue;
        console.log('Updated name to:', editValue);
      } else if (editingCell.col === 'group') {
        // Handle group changing
        newData[editingCell.row].group = editValue;
        // Update target group based on new group
        newData[editingCell.row].targetGroup = groupTargets[editValue] || 0;
        console.log('Updated group to:', editValue);
        console.log('Updated targetGroup to:', groupTargets[editValue] || 0);
      } else {
        // Handle numeric value editing
        const numericValue = parseFloat(editValue) || 0;
        (newData[editingCell.row] as any)[editingCell.col] = numericValue;
        console.log('Updated', editingCell.col, 'to:', numericValue);
        
        // Recalculate totals if editing monthly values
        if (editingCell.col !== 'totalQtyPO') {
          const totalValueSales = newData[editingCell.row].januari + 
                                newData[editingCell.row].februari + 
                                newData[editingCell.row].maret + 
                                newData[editingCell.row].april + 
                                newData[editingCell.row].mei + 
                                newData[editingCell.row].juni + 
                                newData[editingCell.row].juli + 
                                newData[editingCell.row].agustus +
                                newData[editingCell.row].september +
                                newData[editingCell.row].oktober +
                                newData[editingCell.row].november +
                                newData[editingCell.row].desember;
          
          newData[editingCell.row].totalValueSales = totalValueSales;
          console.log('Recalculated totalValueSales to:', totalValueSales);
          
          // totalQtyPO is independent and should not be recalculated
          // It can be edited separately by the user
        }
      }
      
      setData(newData);
      console.log('Updated data state:', newData);
      
      // Save to database
      try {
        setCrudLoading(true); // Start loading indicator
        const rowData = newData[editingCell.row];
        // Convert to PurchaseOrderUIData format
        const purchaseOrder = {
          id: rowData.id,
          name: rowData.name,
          group: rowData.group,
          januari: rowData.januari,
          februari: rowData.februari,
          maret: rowData.maret,
          april: rowData.april,
          mei: rowData.mei,
          juni: rowData.juni,
          juli: rowData.juli,
          agustus: rowData.agustus,
          september: rowData.september,
          oktober: rowData.oktober,
          november: rowData.november,
          desember: rowData.desember,
          totalQtyPO: rowData.totalQtyPO,
          totalValueSales: rowData.totalValueSales,
          targetGroup: rowData.targetGroup,
          achieve: rowData.achieve
        };

        console.log('Sending request to API:', purchaseOrder);
        
        // Add original values if this is a name or group change
        if (originalValues && (editingCell.col === 'name' || editingCell.col === 'group')) {
          console.log('Adding original values to request:', {
            originalName: originalValues.name,
            originalGroup: originalValues.group
          });
          await PurchaseOrdersService.update(purchaseOrder, originalValues.name, originalValues.group);
        } else {
          await PurchaseOrdersService.update(purchaseOrder);
        }
      } catch (error) {
        console.error('Error saving data:', error);
      } finally {
        setCrudLoading(false); // Stop loading indicator
      }
    }
    setEditingCell(null);
    setEditValue("");
    setOriginalValues(null);
  };

  const handleGroupChange = async (rowIndex: number, newGroup: string) => {
    console.log('=== HANDLE GROUP CHANGE ===');
    console.log('Called with:', { rowIndex, newGroup });
    console.log('Current data at row:', data[rowIndex]);
    
    const newData = [...data];
    newData[rowIndex].group = newGroup;
    newData[rowIndex].targetGroup = groupTargets[newGroup] || 0;
    setData(newData);
    
    // Save to database
    try {
      setCrudLoading(true); // Start loading indicator
      const rowData = newData[rowIndex];
      console.log('Row data to save:', rowData);
      
      // Convert to PurchaseOrderUIData format
      const purchaseOrder = {
        id: rowData.id,
        name: rowData.name,
        group: rowData.group,
        januari: rowData.januari,
        februari: rowData.februari,
        maret: rowData.maret,
        april: rowData.april,
        mei: rowData.mei,
        juni: rowData.juni,
        juli: rowData.juli,
        agustus: rowData.agustus,
        september: rowData.september,
        oktober: rowData.oktober,
        november: rowData.november,
        desember: rowData.desember,
        totalQtyPO: rowData.totalQtyPO,
        totalValueSales: rowData.totalValueSales,
        targetGroup: rowData.targetGroup,
        achieve: rowData.achieve
      };
      
      console.log('=== PREPARING TO SEND GROUP CHANGE REQUEST ===');
      console.log('Purchase Order Data:', purchaseOrder);
      console.log('Original Values:', {
        originalName: data[rowIndex].name,
        originalGroup: data[rowIndex].group
      });
      
      const response = await PurchaseOrdersService.update(purchaseOrder, data[rowIndex].name, data[rowIndex].group);
      console.log('API Response:', response);
      
      // Only refresh data if there was an error - otherwise trust our UI update
      // This prevents the UI from reverting to old values if there's a delay or issue with the API
      if (response && (response as any).error) {
        console.log('Error in API response, refreshing data to get correct state');
        await fetchPurchaseOrders();
      } else {
        console.log('Group change successful, keeping UI state');
      }
    } catch (error) {
      console.error('Error saving group change:', error);
      // If there's an error, refresh the data to ensure UI consistency
      console.log('Error occurred, refreshing data to get correct state');
      await fetchPurchaseOrders();
    } finally {
      setCrudLoading(false); // Stop loading indicator
    }
    
    // Exit edit mode
    setEditingCell(null);
    setEditValue("");
    setOriginalValues(null);
  };

  const handleNameEdit = (rowIndex: number, currentName: string) => {
    setEditingCell({ row: rowIndex, col: 'name' });
    setEditValue(currentName);
    setOriginalValues({ name: currentName, group: data[rowIndex].group });
  };

  const handleGroupEdit = (rowIndex: number, currentGroup: string) => {
    console.log('=== HANDLE GROUP EDIT ===');
    console.log('Called with:', { rowIndex, currentGroup });
    console.log('Current data at row:', data[rowIndex]);
    
    setEditingCell({ row: rowIndex, col: 'group' });
    setEditValue(currentGroup);
    setOriginalValues({ name: data[rowIndex].name, group: currentGroup });
    
    console.log('Set original values to:', { name: data[rowIndex].name, group: currentGroup });
  };

  const handleAddGroup = () => {
    if (newGroupName && !availableGroups.includes(newGroupName)) {
      setAvailableGroups([...availableGroups, newGroupName]);
      setGroupTargets({...groupTargets, [newGroupName]: newGroupTarget});
      
      setShowAddGroupModal(false);
      setNewGroupName("");
      setNewGroupTarget(0);
    }
  };

  const handleTargetEdit = (group: string) => {
    setEditingTarget(group);
    setTargetEditValue(groupTargets[group]?.toString() || "0");
  };

  const handleTargetSave = async () => {
    if (editingTarget) {
      const newTarget = parseFloat(targetEditValue) || 0;
      const newGroupTargets = {...groupTargets, [editingTarget]: newTarget};
      setGroupTargets(newGroupTargets);
      
      // Update all members of this group with the new target
      const newData = data.map(item => {
        if (item.group === editingTarget) {
          return {...item, targetGroup: newTarget};
        }
        return item;
      });
      setData(newData);
      
      // Save to database - update all members of the group
      try {
        setCrudLoading(true); // Start loading indicator
        const groupMembers = newData.filter(item => item.group === editingTarget);
        for (const member of groupMembers) {
          // Convert to PurchaseOrderUIData format
          const purchaseOrder = {
            id: member.id,
            name: member.name,
            group: member.group,
            januari: member.januari,
            februari: member.februari,
            maret: member.maret,
            april: member.april,
            mei: member.mei,
            juni: member.juni,
            juli: member.juli,
            agustus: member.agustus,
            september: member.september,
            oktober: member.oktober,
            november: member.november,
            desember: member.desember,
            totalQtyPO: member.totalQtyPO,
            totalValueSales: member.totalValueSales,
            targetGroup: newTarget
          };
          
          await PurchaseOrdersService.update(purchaseOrder);
        }
      } catch (error) {
        console.error('Error saving target:', error);
      } finally {
        setCrudLoading(false); // Stop loading indicator
      }
    }
    setEditingTarget(null);
    setTargetEditValue("");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'No': item.no,
      'Name': item.name,
      'Januari': item.januari,
      'Februari': item.februari,
      'Maret': item.maret,
      'April': item.april,
      'Mei': item.mei,
      'Juni': item.juni,
      'Juli': item.juli,
      'Agustus': item.agustus,
      'September': item.september,
      'Oktober': item.oktober,
      'November': item.november,
      'Desember': item.desember,
      'Total Qty PO': item.totalQtyPO,
      'Total Value Sales': item.totalValueSales,
      'Group': item.group,
      'Target Group': item.targetGroup || 0,
      'Achievement %': item.targetGroup ? ((item.totalValueSales / item.targetGroup) * 100).toFixed(2) : 0
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Order 2025');
    XLSX.writeFile(workbook, 'Purchase_Order_2025.xlsx');
  };

  // Type definitions
interface GroupColors {
  A: [number, number, number];
  B: [number, number, number];
  C: [number, number, number];
  D: [number, number, number];
}

interface Colors {
  primary: [number, number, number];
  dark: [number, number, number];
  gray: [number, number, number];
  light: [number, number, number];
  border: [number, number, number];
  white: [number, number, number];
  groups: GroupColors;
}

interface SummaryCard {
  title: string;
  value: string;
  color: [number, number, number];
}

const exportToPDF = (): void => {
  const doc = new jsPDF('landscape', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Color constants with proper TypeScript types
  const colors: Colors = {
    primary: [59, 130, 246],
    dark: [17, 24, 39],
    gray: [107, 114, 128],
    light: [249, 250, 251],
    border: [229, 231, 235],
    white: [255, 255, 255],
    groups: {
      A: [59, 130, 246],
      B: [16, 185, 129],
      C: [245, 158, 11],
      D: [139, 92, 246]
    }
  };

  let currentY = 30;

  // Helper function to add spacing
  const addSpacing = (space: number = 10): number => {
    currentY += space;
    return currentY;
  };

  // Helper function to draw section separator
  const drawSectionSeparator = (p0: number): void => {
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(1);
    doc.line(30, currentY, pageWidth - 30, currentY);
    addSpacing(15);
  };

  // Safe group color getter
  const getGroupColor = (group: string): [number, number, number] => {
    if (group in colors.groups) {
      return colors.groups[group as keyof GroupColors];
    }
    return colors.gray;
  };

  // ==================== HEADER SECTION ====================
  const drawHeader = (): void => {
    
    // For now, using a placeholder that indicates where the logo should be
    doc.setFillColor(colors.groups.C[0], colors.groups.C[1], colors.groups.C[2]); // Orange background
    doc.rect(30, currentY, 40, 40, 'F');
    
    // Stylized placeholder for the Rame logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text('R', 50, currentY + 25, { align: "center" });
    
    // Company name and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.text('PT. Rame Rekaguna Prakarsa', 80, currentY + 15);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text('Purchase Order Report - Dashboard Summary 2025', 80, currentY + 35);
    
    // Current date on the right
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.setFontSize(10);
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    const dateText = `Generated: ${formattedDate}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - 30 - dateWidth, currentY + 25);
    
    addSpacing(60);
    drawSectionSeparator(15);
  };

  // ==================== SUMMARY CARDS ====================
  const drawSummaryCards = (): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    addSpacing(20); // Tambah jarak atas di sini
    doc.text('Dashboard Overview', 30, currentY);
    addSpacing(25);

    const cardWidth = 180;
    const cardHeight = 80;
    const cardSpacing = 20;

    const summaryData: SummaryCard[] = [
      {
        title: 'Total Sales',
        value: `Rp ${formatCurrency(getTotalSales())}`,
        color: colors.groups.A
      },
      {
        title: 'Total Qty PO',
        value: getTotalQtyPO().toLocaleString(),
        color: colors.groups.B
      },
      {
        title: 'Total Target',
        value: `Rp ${formatCurrency(getTotalTarget())}`,
        color: colors.groups.C
      },
      {
        title: 'Achievement',
        value: `${getTotalAchievement().toFixed(2)}%`,
        color: colors.groups.D
      }
    ];

    summaryData.forEach((card, index) => {
      const x = 30 + (index * (cardWidth + cardSpacing));
      const y = currentY;

      // Card background
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(1);
      doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, 'FD');

      // Color accent line
      doc.setFillColor(card.color[0], card.color[1], card.color[2]);
      doc.rect(x, y, cardWidth, 4, 'F');

      // Card title
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.text(card.title, x + 15, y + 25);

      // Card value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
      doc.text(card.value, x + 15, y + 50);
    });

    addSpacing(100);
    drawSectionSeparator(15);
  };

  // ==================== GROUP PERFORMANCE ====================
const drawGroupPerformance = (): void => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  addSpacing(20); // Tambah jarak atas di sini
  doc.text('Group Performance Analysis', 30, currentY);
  addSpacing(25);

  let groupCardWidth = 160;
  const groupCardHeight = 100;
  const groupSpacingX = 25;
  const groupSpacingY = 30;
  const cardsPerRow = 2;
  const pageWidth = 595; // Standard A4 width in points (72 dpi)
  const margin = 30;

  // Type assertion for availableGroups if needed
  const groups = availableGroups as string[];
  
  groups.forEach((group: string, index: number) => {
    const groupTotal = getGroupTotals(group);
    const groupTarget = (groupTargets as Record<string, number>)[group] || 0;
    const achievement = groupTarget ? ((groupTotal / groupTarget) * 100) : 0;
    
    // Calculate position based on row and column
    // For first 2 cards: use normal layout
    // For remaining 3 cards: spread across full width
    let x, y;
    
    if (index < 2) {
      // First row - 2 cards
      x = margin + (index * (groupCardWidth + groupSpacingX));
      y = currentY;
    } else {
      // Second row - 3 cards with equal spacing
      const remainingCards = groups.length - 2;
      const availableWidth = pageWidth - (2 * margin);
      const cardWidth = (availableWidth - ((remainingCards - 1) * groupSpacingX)) / remainingCards;
      
      x = margin + ((index - 2) * (cardWidth + groupSpacingX));
      y = currentY + groupCardHeight + groupSpacingY;
      
      // Adjust card width for the second row
      groupCardWidth = cardWidth;
    }

    const groupColor = getGroupColor(group);

    // Group card background
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setDrawColor(groupColor[0], groupColor[1], groupColor[2]);
    doc.setLineWidth(2);
    doc.roundedRect(x, y, groupCardWidth, groupCardHeight, 8, 8, 'FD');

    // Group header
    doc.setFillColor(groupColor[0], groupColor[1], groupColor[2]);
    doc.roundedRect(x, y, groupCardWidth, 25, 8, 8, 'F');
    doc.rect(x, y + 17, groupCardWidth, 8, 'F');

    // Group label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`GROUP ${group}`, x + 15, y + 17);

    // Group statistics
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    
    doc.text(`Total Sales:`, x + 15, y + 40);
    doc.text(`Rp ${formatCurrency(groupTotal)}`, x + 15, y + 55);
    
    doc.text(`Target:`, x + 15, y + 70);
    doc.text(`Rp ${formatCurrency(groupTarget)}`, x + 15, y + 85);

    // Achievement badge
    const achievementColor = achievement >= 100 ? colors.groups.B : 
                            achievement >= 75 ? colors.groups.C : colors.gray;
    doc.setFillColor(achievementColor[0], achievementColor[1], achievementColor[2]);
    doc.roundedRect(x + groupCardWidth - 50, y + 35, 40, 20, 10, 10, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    const achievementText = `${achievement.toFixed(0)}%`;
    const achievementWidth = doc.getTextWidth(achievementText);
    doc.text(achievementText, x + groupCardWidth - 30 - (achievementWidth/2), y + 48);
  });

  // Calculate total height needed (2 rows of cards + spacing)
  const totalHeight = 2 * groupCardHeight + groupSpacingY + 30;
  addSpacing(totalHeight);
  drawSectionSeparator(35);
};

  // ==================== DATA TABLE ====================
  const drawDataTable = (): void => {
    doc.addPage();         // Pindah ke halaman baru
    currentY = 30; 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    addSpacing(20); // Tambah jarak atas di sini
    doc.text('Detailed Purchase Order Data', 30, currentY);
    addSpacing(25);

    // Prepare table data with proper types
    const tableData: string[][] = (data as any[]).map((item: any, index: number): string[] => [
      (index + 1).toString(),
      item.group,
      item.name,
      formatCurrency(item.januari),
      formatCurrency(item.februari),
      formatCurrency(item.maret),
      formatCurrency(item.april),
      formatCurrency(item.mei),
      formatCurrency(item.juni),
      formatCurrency(item.juli),
      formatCurrency(item.agustus),
      formatCurrency(item.september),
      formatCurrency(item.oktober),
      formatCurrency(item.november),
      formatCurrency(item.desember),
      item.totalQtyPO.toLocaleString(),
      formatCurrency(item.totalValueSales)
    ]);

    // Enhanced autoTable configuration
    (autoTable as any)(doc, {
      head: [[
        'No', 'Group', 'Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total Qty', 'Total Sales'
      ]],
      body: tableData,
      startY: currentY,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 4,
        lineColor: colors.border,
        lineWidth: 0.5,
        textColor: colors.dark,
        font: 'helvetica'
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 9
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 25 },
        1: { halign: 'center', cellWidth: 35 },
        2: { halign: 'left', cellWidth: 80 },
        3: { halign: 'right', cellWidth: 45 },
        4: { halign: 'right', cellWidth: 45 },
        5: { halign: 'right', cellWidth: 45 },
        6: { halign: 'right', cellWidth: 45 },
        7: { halign: 'right', cellWidth: 45 },
        8: { halign: 'right', cellWidth: 45 },
        9: { halign: 'right', cellWidth: 45 },
        10: { halign: 'right', cellWidth: 45 },
        11: { halign: 'right', cellWidth: 45 },
        12: { halign: 'right', cellWidth: 45 },
        13: { halign: 'right', cellWidth: 45 },
        14: { halign: 'right', cellWidth: 45 },
        15: { halign: 'right', cellWidth: 50 },
        16: { halign: 'right', cellWidth: 60 }
      },
      alternateRowStyles: {
        fillColor: colors.light
      },
      margin: { top: 30, left: 30, right: 30, bottom: 40 },
      pageBreak: 'auto',
      showHead: 'everyPage',
      didDrawCell: function(data: any) {
        // Color-code group cells with type safety
        if (data.column.index === 1 && data.section === 'body') {
          const group = data.cell.text[0];
          if (group in colors.groups) {
            const groupColor = getGroupColor(group);
            doc.setFillColor(groupColor[0], groupColor[1], groupColor[2]);
            doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(group, data.cell.x + data.cell.width/2, data.cell.y + data.cell.height/2 + 2, { align: 'center' });
          }
        }
      },
      didDrawPage: function(data: any) {
        // Enhanced page footer
        const pageNumber = data.pageNumber;
        const totalPages = doc.getNumberOfPages();
        
        // Footer line
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.setLineWidth(1);
        doc.line(30, pageHeight - 30, pageWidth - 30, pageHeight - 30);
        
        // Company name in footer
        doc.setFontSize(8);
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('PT. Rame Rekaguna Prakarsa - Purchase Order Report', 30, pageHeight - 15);
        
        // Page number
        const pageText = `Page ${pageNumber} of ${totalPages}`;
        const pageTextWidth = doc.getTextWidth(pageText);
        doc.text(pageText, pageWidth - 30 - pageTextWidth, pageHeight - 15);
      }
    });
  };

  // ==================== MAIN EXECUTION ====================
  try {
    drawHeader();
    drawSummaryCards();
    drawGroupPerformance();
    drawDataTable();

    // Generate filename with timestamp
    const currentDate = new Date();
    const timestamp = currentDate.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
    const filename = `Purchase_Order_Report_${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    // Optional: Show success message
    console.log(`PDF exported successfully as: ${filename}`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

  const getGroupTotals = (group: string) => {
    const groupData = data.filter(item => item.group === group);
    return groupData.reduce((sum, item) => sum + item.totalValueSales, 0);
  };

  const getTotalSales = () => {
    return data.reduce((sum, item) => sum + item.totalValueSales, 0);
  };

  const getGroupAchievement = (group: string) => {
    const groupData = data.filter(item => item.group === group);
    const totalGroupSales = groupData.reduce((sum, item) => sum + item.totalValueSales, 0);
    const targetGroup = groupTargets[group] || 0;
    
    if (targetGroup === 0) return 0;
    return (totalGroupSales / targetGroup) * 100;
  };

  const getTotalTarget = () => {
    return availableGroups.reduce((sum, group) => {
      const targetGroup = groupTargets[group] || 0;
      return sum + targetGroup;
    }, 0);
  };

  const getTotalAchievement = () => {
    const totalSales = getTotalSales();
    const totalTarget = getTotalTarget();
    if (totalTarget === 0) return 0;
    return (totalSales / totalTarget) * 100;
  };

  const getTotalQtyPO = () => {
    return data.reduce((sum, item) => sum + item.totalQtyPO, 0);
  };

  const getMonthlyTotals = () => {
    const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return months.map((month, index) => {
      const total = data.reduce((sum, item) => sum + (item as any)[month], 0);
      return {
        month: monthNames[index],
        total: total,
        formatted: formatCurrency(total)
      };
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rame Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Purchase Order by Order Control 2025
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={() => setShowAddGroupModal(true)} 
                variant="outline"
                disabled={crudLoading}
              >
                {crudLoading ? 'Processing...' : 'Tambah Group'}
              </Button>
              <Button 
                onClick={exportToExcel} 
                variant="outline"
                disabled={crudLoading}
              >
                {crudLoading ? 'Processing...' : 'Export Excel'}
              </Button>
              <Button 
                onClick={exportToPDF} 
                variant="outline"
                disabled={crudLoading}
              >
                {crudLoading ? 'Processing...' : 'Export PDF'}
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                disabled={crudLoading}
              >
                {crudLoading ? 'Processing...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {formatCurrency(getTotalSales())}</div>
              <div className="text-xs text-muted-foreground">
                Target: Rp {formatCurrency(getTotalTarget())}
              </div>
              <div className="text-xs text-muted-foreground">
                Achievement: {getTotalAchievement().toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                💡 Klik target di group cards untuk mengedit
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Qty PO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalQtyPO().toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Jumlah keseluruhan purchase order
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                💡 Total quantity dari semua PO
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {availableGroups.map((group) => {
            const targetGroup = groupTargets[group] || 0;
            const groupColors: {[key: string]: string} = {
              'A': 'bg-blue-100 text-blue-800',
              'B': 'bg-green-100 text-green-800',
              'C': 'bg-yellow-100 text-yellow-800',
              'D': 'bg-purple-100 text-purple-800',
              'Other': 'bg-gray-100 text-gray-800'
            };
            const colorClass = groupColors[group] || 'bg-gray-100 text-gray-800';
            
            return (
              <Card key={group}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Group {group}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rp {formatCurrency(getGroupTotals(group))}</div>
                  <div className="text-xs text-muted-foreground">
                    Target: 
                    {editingTarget === group ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={targetEditValue}
                          onChange={(e) => setTargetEditValue(e.target.value)}
                          onBlur={handleTargetSave}
                          onKeyDown={(e) => e.key === 'Enter' && handleTargetSave()}
                          className="w-24 h-6 text-xs"
                          autoFocus
                        />
                        <span className="text-xs">Rp</span>
                      </div>
                    ) : (
                      <span 
                        className="cursor-pointer hover:bg-blue-100 px-1 rounded"
                        onClick={() => handleTargetEdit(group)}
                      >
                        Rp {formatCurrency(targetGroup)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Achievement: {getGroupAchievement(group).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          {/* Monthly Total Sales Chart */}
          <Card className="w-full pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle>Total Sales per Bulan</CardTitle>
                <CardDescription>
                  Grafik total penjualan setiap bulan
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 w-full">
              <ChartContainer config={monthlyChartConfig} className="aspect-auto h-[400px] w-full">
                <AreaChart data={getMonthlyTotals()}>
                  <defs>
                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-total)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-total)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    width={100}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip 
                    cursor={false}
                    content={
                      <ChartTooltipContent 
                        formatter={(value: any) => [formatCurrency(Number(value)), 'Total Sales']}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        indicator="dot"
                      />
                    }
                  />
                  <Area 
                    type="natural" 
                    dataKey="total" 
                    fill="url(#fillTotal)" 
                    stroke="var(--color-total)" 
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Purchase Order Data</CardTitle>
                <CardDescription>
                  Klik pada cell untuk mengedit data
                </CardDescription>
              </div>
              <Button onClick={() => handleAddPerson()} disabled={crudLoading}>
                {crudLoading ? 'Processing...' : 'Tambah Person'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-lg">Loading data...</div>
              </div>
            ) : (
            <div className="overflow-x-auto relative">
              {crudLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                    <span className="text-gray-600 text-sm">Updating...</span>
                  </div>
                </div>
              )}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 px-2 py-1 text-left">No</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Group</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Januari</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Februari</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Maret</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">April</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Mei</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Juni</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Juli</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Agustus</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">September</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Oktober</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">November</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Desember</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Total Qty PO</th>
                    <th className="border border-gray-300 px-2 py-1 text-right">Total Value Sales</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 px-2 py-1 text-center">{row.no}</td>
                      <td 
                        className="border border-gray-300 px-2 py-1 text-center cursor-pointer hover:bg-blue-100"
                        onClick={() => handleGroupEdit(rowIndex, row.group)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === 'group' ? (
                          <select
                            value={editValue}
                            onChange={(e) => handleGroupChange(rowIndex, e.target.value)}
                            className="w-full h-6 text-xs border rounded"
                            autoFocus
                          >
                            {availableGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            row.group === 'A' ? 'bg-blue-100 text-blue-800' :
                            row.group === 'B' ? 'bg-green-100 text-green-800' :
                            row.group === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            row.group === 'D' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {row.group}
                          </span>
                        )}
                      </td>
                      <td 
                        className="border border-gray-300 px-2 py-1 cursor-pointer hover:bg-blue-100"
                        onClick={() => handleNameEdit(rowIndex, row.name)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === 'name' ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleCellSave()}
                            className="w-full h-6 text-xs"
                            autoFocus
                          />
                        ) : (
                          row.name
                        )}
                      </td>
                      {['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'].map((month) => (
                        <td 
                          key={month}
                          className="border border-gray-300 px-2 py-1 text-right cursor-pointer hover:bg-blue-100"
                          onClick={() => handleCellEdit(rowIndex, month, (row as any)[month])}
                        >
                          {editingCell?.row === rowIndex && editingCell?.col === month ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={(e) => e.key === 'Enter' && handleCellSave()}
                              className="w-20 h-6 text-xs"
                              autoFocus
                            />
                          ) : (
                            formatCurrency((row as any)[month])
                          )}
                        </td>
                      ))}
                      <td 
                        className="border border-gray-300 px-2 py-1 text-right cursor-pointer hover:bg-blue-100"
                        onClick={() => handleCellEdit(rowIndex, 'totalQtyPO', row.totalQtyPO)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === 'totalQtyPO' ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleCellSave()}
                            className="w-20 h-6 text-xs"
                            autoFocus
                          />
                        ) : (
                          row.totalQtyPO.toLocaleString()
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                        {formatCurrency(row.totalValueSales)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePerson(rowIndex)}
                          disabled={crudLoading}
                        >
                          {crudLoading ? '...' : 'Hapus'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Group Baru</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nama Group</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Masukkan nama group"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="groupTarget">Target Group (Rp)</Label>
                <Input
                  id="groupTarget"
                  type="number"
                  value={newGroupTarget}
                  onChange={(e) => setNewGroupTarget(Number(e.target.value))}
                  placeholder="Masukkan target group"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddGroupModal(false);
                  setNewGroupName("");
                  setNewGroupTarget(0);
                }}
              >
                Batal
              </Button>
              <Button onClick={handleAddGroup}>
                Tambah Group
              </Button>
            </div>
          </div>
        </div>
      )}
      {crudLoading && <LoadingSpinner />}
    </div>
  );
}
