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
      const response = await fetch('/api/purchase-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch purchase orders');
      }
      const result = await response.json();
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
        group: item.groupName,
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
      const response = await fetch('/api/purchase-orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: personToDelete.name,
          group: personToDelete.group
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete person');
      }
      
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
    
    // Convert to database format (using group, not groupName)
    const dbOrder = {
      name: newPerson.name,
      group: newPerson.group,  // Changed from groupName to group
      januari: newPerson.januari,
      februari: newPerson.februari,
      maret: newPerson.maret,
      april: newPerson.april,
      mei: newPerson.mei,
      juni: newPerson.juni,
      juli: newPerson.juli,
      agustus: newPerson.agustus,
      september: newPerson.september,
      oktober: newPerson.oktober,
      november: newPerson.november,
      desember: newPerson.desember,
      totalQtyPO: newPerson.totalQtyPO,
      totalValueSales: newPerson.totalValueSales,
      targetGroup: newPerson.targetGroup
    };
    
    // Save to database first
    try {
      setCrudLoading(true); // Start loading indicator
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbOrder),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create person');
      }
      
      const createdOrder = await response.json();
      
      // Add to UI only if database save is successful
      const newData = [...data, {
        ...newPerson,
        id: createdOrder.id
      }];
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
            
            const response = await fetch('/api/purchase-orders', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...purchaseOrder,
                originalName: originalValues.name,
                originalGroup: originalValues.group
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to update person');
            }
          } else {
            const response = await fetch('/api/purchase-orders', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(purchaseOrder),
            });
            
            if (!response.ok) {
              throw new Error('Failed to update person');
            }
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
      
      const response = await fetch('/api/purchase-orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...purchaseOrder,
          originalName: data[rowIndex].name,
          originalGroup: data[rowIndex].group
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update group');
      }
      
      const updateResponse = await response.json();
      console.log('API Response:', updateResponse);
      
      // Only refresh data if there was an error - otherwise trust our UI update
      // This prevents the UI from reverting to old values if there's a delay or issue with the API
      if (updateResponse && (updateResponse as any).error) {
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
          
          const response = await fetch('/api/purchase-orders', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseOrder),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update target');
          }
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

  const handleRemoveGroup = async (groupName: string) => {
    // Confirmation
    if (!confirm(`Apakah Anda yakin ingin menghapus group ${groupName}? Ini akan menghapus semua person dalam group ini.`)) {
      return;
    }
    
    try {
      setCrudLoading(true); // Start loading indicator
      
      // Delete all purchase orders in the group
      const response = await fetch('/api/groups', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group: groupName }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete group');
      }
      
      // Remove the group from available groups
      const newAvailableGroups = availableGroups.filter(group => group !== groupName);
      setAvailableGroups(newAvailableGroups);
      
      // Remove the group target
      const newGroupTargets = { ...groupTargets };
      delete newGroupTargets[groupName];
      setGroupTargets(newGroupTargets);
      
      // Remove all persons in this group from the data
      const newData = data.filter(item => item.group !== groupName);
      // Update row numbers
      const updatedData = newData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData(updatedData);
      
    } catch (error: any) {
      console.error('Error deleting group:', error);
      alert(`Terjadi kesalahan saat menghapus group: ${error.message || 'Silakan coba lagi.'}`);
    } finally {
      setCrudLoading(false); // Stop loading indicator
    }
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
  const doc = new jsPDF('landscape', 'pt', 'a3');
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
  addSpacing(20);
  doc.text('Dashboard Overview', 30, currentY);
  addSpacing(25);

  // âœ… Ambil ukuran halaman
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 30;
  const cardHeight = 80;
  const cardSpacing = 20;

  // Data summary
  const summaryData: SummaryCard[] = [
    { title: 'Total Sales', value: `Rp ${formatCurrency(getTotalSales())}`, color: colors.groups.A },
    { title: 'Total Qty PO', value: getTotalQtyPO().toLocaleString(), color: colors.groups.B },
    { title: 'Total Target', value: `Rp ${formatCurrency(getTotalTarget())}`, color: colors.groups.C },
    { title: 'Achievement', value: `${getTotalAchievement().toFixed(2)}%`, color: colors.groups.D }
  ];

  // âœ… Hitung ulang cardWidth biar pas 4 kolom
  const availableWidth = pageWidth - (2 * margin) - ((summaryData.length - 1) * cardSpacing);
  const cardWidth = availableWidth / summaryData.length;

  summaryData.forEach((card, index) => {
    const x = margin + (index * (cardWidth + cardSpacing));
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

  addSpacing(cardHeight + 40);
  drawSectionSeparator(15);
};


  // ==================== GROUP PERFORMANCE ====================
const drawGroupPerformance = (): void => {
  // Section Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  addSpacing(20);
  doc.text('Group Performance Analysis', 30, currentY);
  addSpacing(25);

  const groupCardHeight = 100;
  const groupSpacingX = 25;
  const groupSpacingY = 30;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 30;

  const groups = availableGroups as string[];

  // âœ… helper function untuk label + value
  const drawLabelValue = (label: string, value: string, x: number, y: number): number => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.text(label, x, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.text(value, x, y + 12);

    return y + 28; // balikin Y berikutnya untuk entry lain
  };

  groups.forEach((group: string, index: number) => {
    const groupTotal = getGroupTotals(group);
    const groupTarget = (groupTargets as Record<string, number>)[group] || 0;
    const achievement = groupTarget ? ((groupTotal / groupTarget) * 100) : 0;

    let x, y, cardWidth;

    if (index < 2) {
      // ðŸ”¹ Baris pertama: 2 kartu
      const availableWidth = pageWidth - (2 * margin);
      cardWidth = (availableWidth - groupSpacingX) / 2;

      x = margin + (index * (cardWidth + groupSpacingX));
      y = currentY;
    } else {
      // ðŸ”¹ Baris kedua: sisanya bagi rata
      const remainingCards = groups.length - 2;
      const availableWidth = pageWidth - (2 * margin);
      cardWidth = (availableWidth - ((remainingCards - 1) * groupSpacingX)) / remainingCards;

      x = margin + ((index - 2) * (cardWidth + groupSpacingX));
      y = currentY + groupCardHeight + groupSpacingY;
    }

    const groupColor = getGroupColor(group);

    // Card background
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setDrawColor(groupColor[0], groupColor[1], groupColor[2]);
    doc.setLineWidth(2);
    doc.roundedRect(x, y, cardWidth, groupCardHeight, 8, 8, 'FD');

    // Header strip
    doc.setFillColor(groupColor[0], groupColor[1], groupColor[2]);
    doc.roundedRect(x, y, cardWidth, 25, 8, 8, 'F');
    doc.rect(x, y + 17, cardWidth, 8, 'F');

    // Label group
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`GROUP ${group}`, x + 15, y + 17);

    // Stats
    let statsY = y + 40;
    statsY = drawLabelValue("Total Sales", `Rp ${formatCurrency(groupTotal)}`, x + 15, statsY);
    statsY = drawLabelValue("Target", `Rp ${formatCurrency(groupTarget)}`, x + 15, statsY);

    // Achievement badge
    const achievementColor = achievement >= 100 ? colors.groups.B :
                             achievement >= 75 ? colors.groups.C : colors.gray;

    doc.setFillColor(achievementColor[0], achievementColor[1], achievementColor[2]);
    doc.roundedRect(x + cardWidth - 50, y + 35, 40, 20, 10, 10, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    const achievementText = `${achievement.toFixed(0)}%`;
    const textWidth = doc.getTextWidth(achievementText);
    doc.text(achievementText, x + cardWidth - 30 - (textWidth/2), y + 48);
  });

  // âœ… Tambah spacing setelah semua cards
  const totalHeight = groupCardHeight * 2 + groupSpacingY + 30;
  addSpacing(totalHeight);
  drawSectionSeparator(35);
};

/**
 * Draws a professional horizontal group performance chart on PDF
 * Shows performance comparison between different groups/categories
 */
const drawGroupPerformanceChart = (): void => {
  // Initialize new page
  doc.addPage();
  currentY = PAGE_MARGIN;

  const groupPageConfig = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: PAGE_MARGIN
  };

  const chartConfig = {
    width: groupPageConfig.width - 2 * groupPageConfig.margin - 80,
    height: 320,
    x: groupPageConfig.margin + 40,
    y: 0, // Will be set after drawing header
    barHeight: 35, // Height of each horizontal bar
    barSpacing: 15, // Space between bars
    topPadding: 40,
    bottomPadding: 30,
    leftPadding: 100, // Space for group labels on the left
    rightPadding: 60  // Space for value labels on the right
  };

  // Draw chart header
  drawGroupChartHeader();
  
  // Set chart Y position after header
  chartConfig.y = currentY;
  
  // Get and validate data
  const groupData = getGroupPerformanceData();
  if (!groupData || groupData.length === 0) {
    drawNoGroupDataMessage();
    return;
  }

  // Calculate chart dimensions
  const chartMetrics = calculateHorizontalChartMetrics(groupData, chartConfig);
  
  // Draw chart components
  drawHorizontalChartAxes(chartConfig, groupData.length);
  drawHorizontalBarsWithLabels(groupData, chartConfig, chartMetrics);
  drawHorizontalGroupLabels(groupData, chartConfig);
  
  // Update position for next section
  currentY += chartConfig.height + 50;
  drawSectionSeparator(15);
};

/**
 * Draws the group chart header with title and description
 */
const drawGroupChartHeader = (): void => {
  // Main title
  currentY += 25; 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(groupChartColors.primaryDark[0], groupChartColors.primaryDark[1], groupChartColors.primaryDark[2]);
  doc.text('Group Performance Analysis', PAGE_MARGIN, currentY);
  currentY += 20;
  
  // Subtitle/description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(groupChartColors.textSecondary[0], groupChartColors.textSecondary[1], groupChartColors.textSecondary[2]);
  doc.text('Comparison of sales performance between groups', PAGE_MARGIN, currentY);
  currentY += 10;
};

/**
 * Gets group performance data from actual sales data
 */
const getGroupPerformanceData = (): GroupData[] => {
  // Calculate totals for each group based on actual data from the state
  const groupTotals: Record<string, number> = {};
  
  // Initialize all available groups with 0
  availableGroups.forEach(group => {
    groupTotals[group] = 0;
  });
  
  // Aggregate data by group
  data.forEach(item => {
    const group = item.group;
    if (groupTotals.hasOwnProperty(group)) {
      groupTotals[group] += item.totalValueSales;
    }
  });
  
  const totalSales = Object.values(groupTotals).reduce((sum, val) => sum + val, 0);
  
  // Convert to GroupData array
  return availableGroups.map((groupName, index) => {
    const total = groupTotals[groupName] || 0;
    
    // Assign colors cyclically
    const colors = [
      groupChartColors.groupA,
      groupChartColors.groupB,
      groupChartColors.groupC,
      groupChartColors.groupD,
      groupChartColors.groupE
    ];
    
    return {
      group: groupName === 'Other' ? 'Other' : `Group ${groupName}`,
      total: total,
      percentage: totalSales > 0 ? (total / totalSales * 100) : 0,
      color: colors[index % colors.length]
    };
  });
};

/**
 * Calculates horizontal chart metrics based on data and configuration
 */
const calculateHorizontalChartMetrics = (data: GroupData[], config: any) => {
  const maxValue = Math.max(...data.map(item => item.total));
  const barCount = data.length;
  
  // Calculate available width for bars
  const availableWidth = config.width - config.leftPadding - config.rightPadding;
  
  return {
    maxValue,
    barCount,
    availableWidth,
    paddedMaxValue: maxValue * 1.1, // 10% padding
    totalHeight: barCount * (config.barHeight + config.barSpacing) - config.barSpacing
  };
};

/**
 * Draws horizontal chart axes
 */
const drawHorizontalChartAxes = (config: any, barCount: number): void => {
  doc.setDrawColor(groupChartColors.borderPrimary[0], groupChartColors.borderPrimary[1], groupChartColors.borderPrimary[2]);
  doc.setLineWidth(0.5);
  
  const chartStartY = config.y + config.topPadding;
  const chartStartX = config.x + config.leftPadding;
  const chartEndX = config.x + config.width - config.rightPadding;
  const totalHeight = barCount * (config.barHeight + config.barSpacing);
  
  // Horizontal lines for each bar
  for (let i = 0; i <= barCount; i++) {
    const yPos = chartStartY + (i * (config.barHeight + config.barSpacing));
    doc.setDrawColor(groupChartColors.gridLight[0], groupChartColors.gridLight[1], groupChartColors.gridLight[2]);
    doc.setLineWidth(0.3);
    doc.line(chartStartX, yPos, chartEndX, yPos);
  }
  
  // Vertical line (Y-axis)
  doc.setDrawColor(groupChartColors.borderPrimary[0], groupChartColors.borderPrimary[1], groupChartColors.borderPrimary[2]);
  doc.setLineWidth(1);
  doc.line(chartStartX, chartStartY, chartStartX, chartStartY + totalHeight);
};

/**
 * Draws horizontal bars with values and different colors
 */
const drawHorizontalBarsWithLabels = (
  data: GroupData[], 
  config: any, 
  metrics: any
): void => {
  const chartStartY = config.y + config.topPadding;
  const chartStartX = config.x + config.leftPadding;
  
  data.forEach((item, index) => {
    const barWidth = (item.total / metrics.paddedMaxValue) * metrics.availableWidth;
    const barY = chartStartY + (index * (config.barHeight + config.barSpacing)) + 2;
    const barX = chartStartX + 1;
    
    // Draw horizontal bar
    drawHorizontalStyledBar(barX, barY, barWidth, config.barHeight - 4, item.color);
    
    // Draw value label at the end of bar
    drawHorizontalBarValueLabel(item.total, item.percentage, barX + barWidth, barY, config.barHeight - 4);
  });
};

/**
 * Draws a styled horizontal bar with group-specific color
 */
const drawHorizontalStyledBar = (x: number, y: number, width: number, height: number, color: [number, number, number]): void => {
  // Draw bar even if width is 0 to maintain visual consistency
  // For zero values, we draw a minimal bar of 1px width
  const actualWidth = width < 1 ? 1 : width;
  
  // Main bar
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(x, y, actualWidth, height, 'F');
  
  // Add subtle border
  doc.setDrawColor(Math.max(0, color[0] - 30), Math.max(0, color[1] - 30), Math.max(0, color[2] - 30));
  doc.setLineWidth(0.5);
  doc.rect(x, y, actualWidth, height, 'S');
  
  // Add gradient effect (lighter top portion)
  if (height > 10) {
    doc.setFillColor(Math.min(255, color[0] + 40), Math.min(255, color[1] + 40), Math.min(255, color[2] + 40));
    doc.rect(x, y, actualWidth, height * 0.4, 'F');
  }
};

/**
 * Draws value and percentage label at the end of each horizontal bar
 */
const drawHorizontalBarValueLabel = (value: number, percentage: number, x: number, y: number, height: number): void => {
  const labelX = x + 8; // Small offset from bar end
  const centerY = y + height / 2;
  
  // Value label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(groupChartColors.textPrimary[0], groupChartColors.textPrimary[1], groupChartColors.textPrimary[2]);
  
  const formattedValue = formatCurrencyCompact(value);
  doc.text(formattedValue, labelX, centerY - 2);
  
  // Percentage label
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(groupChartColors.textSecondary[0], groupChartColors.textSecondary[1], groupChartColors.textSecondary[2]);
  
  const percentageText = `(${percentage.toFixed(1)}%)`;
  doc.text(percentageText, labelX, centerY + 6);
};

/**
 * Draws group labels on the left side
 */
const drawHorizontalGroupLabels = (data: GroupData[], config: any): void => {
  const chartStartY = config.y + config.topPadding;
  const labelX = config.x + config.leftPadding - 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(groupChartColors.textSecondary[0], groupChartColors.textSecondary[1], groupChartColors.textSecondary[2]);
  
  data.forEach((item, index) => {
    const barY = chartStartY + (index * (config.barHeight + config.barSpacing));
    const centerY = barY + config.barHeight / 2 + 2;
    
    const textWidth = doc.getTextWidth(item.group);
    doc.text(item.group, labelX - textWidth, centerY);
  });
};

/**
 * Draws message when no group data is available
 */
const drawNoGroupDataMessage = (): void => {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(groupChartColors.textMuted[0], groupChartColors.textMuted[1], groupChartColors.textMuted[2]);
  doc.text('Tidak ada data performance grup untuk ditampilkan', PAGE_MARGIN, currentY);
  currentY += 30;
};

// Type definitions for group chart
interface GroupData {
  group: string;
  total: number;
  percentage: number;
  color: [number, number, number];
}

// Color scheme for group chart
const groupChartColors = {
  primaryDark: [33, 37, 41] as [number, number, number],
  textPrimary: [33, 37, 41] as [number, number, number],
  textSecondary: [108, 117, 125] as [number, number, number],
  textMuted: [134, 142, 150] as [number, number, number],
  borderPrimary: [206, 212, 218] as [number, number, number],
  gridLight: [233, 236, 239] as [number, number, number],
  // Group-specific colors
  groupA: [59, 130, 246] as [number, number, number],    
  groupB: [16, 185, 129] as [number, number, number],      
  groupC: [245, 158, 11] as [number, number, number],    
  groupD: [139, 92, 246] as [number, number, number],    
  groupE: [108, 117, 125] as [number, number, number]    
};

// Note: Utility functions formatCurrencyShort and formatCurrencyCompact 
// are already defined in the monthly chart section above

/**
 * Draws a professional monthly sales chart on PDF
 * Features improved code organization, better naming, and enhanced visual styling
 */
const drawMonthlyChart = (): void => {
  // Initialize new page

  const pageConfig = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: PAGE_MARGIN
  };

  const monthlyPageConfig = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: PAGE_MARGIN
  };

  const chartConfig = {
    width: monthlyPageConfig.width - 2 * monthlyPageConfig.margin - 60, // Kurangi 60px untuk margin kiri-kanan tambahan
    height: 280,
    x: monthlyPageConfig.margin + 30, // Tambah 30px margin kiri
    y: 0, // Will be set after drawing header
    barSpacing: 0.3, // 30% spacing between bars for better proportions
    gridLines: 6,
    topPadding: 60, // Tambah dari 40px ke 60px untuk ruang atas lebih luas
    bottomPadding: 40, // Tambah dari 25px ke 40px untuk ruang bawah lebih luas
    leftPadding: 40, // Ruang untuk Y-axis labels
    rightPadding: 20 // Ruang margin kanan
  };

  // Draw chart header
  drawChartHeader();
  
  // Set chart Y position after header
  chartConfig.y = currentY;
  
  // Get and validate data
  const monthlyData = getMonthlyTotals();
  if (!monthlyData || monthlyData.length === 0) {
    drawNoDataMessage();
    return;
  }

  // Calculate chart dimensions
  const chartMetrics = calculateChartMetrics(monthlyData, chartConfig);
  
  // Draw chart components
  drawChartAxes(chartConfig);
  drawYAxisLabelsAndGrid(chartConfig, chartMetrics);
  drawBarsWithLabels(monthlyData, chartConfig, chartMetrics);
  drawXAxisLabels(monthlyData, chartConfig);
  
  // Update position for next section
  currentY += chartConfig.height + 70; // Tambah dari 50 ke 70 untuk jarak ke section berikutnya
  drawSectionSeparator(15);
};

/**
 * Draws the chart header with title and description
 */
const drawChartHeader = (): void => {
  // Main title
  currentY += 25; 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(chartColors.primaryDark[0], chartColors.primaryDark[1], chartColors.primaryDark[2]);
  doc.text('Monthly Sales Analysis', PAGE_MARGIN, currentY);
  currentY += 20;
  
  // Subtitle/description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(chartColors.textSecondary[0], chartColors.textSecondary[1], chartColors.textSecondary[2]);
  doc.text('Chart comparing total sales per month within the reporting period', PAGE_MARGIN, currentY);
  currentY += 10; // Tambah dari 35 ke 45 untuk jarak lebih luas ke chart
};

/**
 * Calculates chart metrics based on data and configuration
 */
const calculateChartMetrics = (data: MonthlyData[], config: ChartConfig) => {
  const maxValue = Math.max(...data.map(item => item.total));
  const barCount = data.length;
  
  // Calculate available space for bars (excluding left and right padding)
  const availableWidth = config.width - config.leftPadding - config.rightPadding;
  const totalBarWidth = availableWidth / barCount;
  const barSpacing = totalBarWidth * config.barSpacing;
  const actualBarWidth = totalBarWidth - barSpacing;

  return {
    maxValue,
    barCount,
    totalBarWidth,
    barSpacing,
    actualBarWidth,
    // Add 20% padding for better visual balance and space for labels
    paddedMaxValue: maxValue * 1.2,
    // Effective chart height (excluding top and bottom padding)
    effectiveHeight: config.height - config.topPadding - config.bottomPadding
  };
};

/**
 * Draws chart axes with proper styling
 */
const drawChartAxes = (config: ChartConfig): void => {
  doc.setDrawColor(chartColors.borderPrimary[0], chartColors.borderPrimary[1], chartColors.borderPrimary[2]);
  doc.setLineWidth(1);
  
  const chartStartY = config.y + config.topPadding;
  const chartEndY = chartStartY + (config.height - config.topPadding - config.bottomPadding);
  const axisStartX = config.x + config.leftPadding;
  
  // Y-axis (vertical line)
  doc.line(
    axisStartX,
    chartStartY, 
    axisStartX, 
    chartEndY
  );
  
  // X-axis (horizontal line)
  doc.line(
    axisStartX, 
    chartEndY, 
    config.x + config.width - config.rightPadding, 
    chartEndY
  );
};

/**
 * Draws Y-axis labels and horizontal grid lines
 */
const drawYAxisLabelsAndGrid = (config: ChartConfig, metrics: ChartMetrics): void => {
  const { gridLines } = config;
  const { paddedMaxValue } = metrics;
  
  const chartStartY = config.y + config.topPadding;
  const effectiveHeight = metrics.effectiveHeight;
  const axisStartX = config.x + config.leftPadding;

  for (let i = 0; i <= gridLines; i++) {
    const yValue = (paddedMaxValue * i) / gridLines;
    const yPosition = chartStartY + effectiveHeight - (effectiveHeight * i) / gridLines;
    
    // Draw grid line (skip the bottom line as it's the X-axis)
    if (i > 0) {
      doc.setDrawColor(chartColors.gridLight[0], chartColors.gridLight[1], chartColors.gridLight[2]);
      doc.setLineWidth(0.3);
      doc.line(axisStartX + 1, yPosition, config.x + config.width - config.rightPadding, yPosition);
    }
    
    // Draw Y-axis label
    drawYAxisLabel(yValue, axisStartX, yPosition);
  }
};

/**
 * Draws individual Y-axis label with proper formatting
 */
const drawYAxisLabel = (value: number, x: number, y: number): void => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(chartColors.textMuted[0], chartColors.textMuted[1], chartColors.textMuted[2]);
  
  const formattedValue = formatCurrencyShort(value);
  const textWidth = doc.getTextWidth(formattedValue);
  
  doc.text(formattedValue, x - textWidth - 5, y + 2);
};

/**
 * Draws bars with values and improved visual styling
 */
const drawBarsWithLabels = (
  data: MonthlyData[], 
  config: ChartConfig, 
  metrics: ChartMetrics
): void => {
  const chartStartY = config.y + config.topPadding;
  const axisStartX = config.x + config.leftPadding;
  
  data.forEach((item, index) => {
    const barHeight = (item.total / metrics.paddedMaxValue) * metrics.effectiveHeight;
    const barX = axisStartX + (metrics.totalBarWidth * index) + (metrics.barSpacing / 2);
    const barY = chartStartY + metrics.effectiveHeight - barHeight;
    
    // Only draw bar if height is significant
    if (barHeight > 2) {
      // Draw bar with gradient effect simulation
      drawStyledBar(barX, barY, metrics.actualBarWidth, barHeight);
      
      // Draw value label above bar
      drawBarValueLabel(item.total, barX, barY, metrics.actualBarWidth);
    } else {
      // For very small values, still show the label
      drawBarValueLabel(item.total, barX, chartStartY + metrics.effectiveHeight - 10, metrics.actualBarWidth);
    }
  });
};

/**
 * Draws a styled bar with visual enhancements
 */
const drawStyledBar = (x: number, y: number, width: number, height: number): void => {
  // Main bar
  doc.setFillColor(chartColors.chartPrimary[0], chartColors.chartPrimary[1], chartColors.chartPrimary[2]);
  doc.rect(x, y, width, height, 'F');
  
  // Add subtle border for better definition
  doc.setDrawColor(chartColors.chartPrimaryDark[0], chartColors.chartPrimaryDark[1], chartColors.chartPrimaryDark[2]);
  doc.setLineWidth(0.5);
  doc.rect(x, y, width, height, 'S');
  
  // Add highlight effect (top portion)
  if (height > 20) {
    doc.setFillColor(chartColors.chartHighlight[0], chartColors.chartHighlight[1], chartColors.chartHighlight[2]);
    doc.rect(x, y, width, Math.min(height * 0.3, 15), 'F');
  }
};

/**
 * Draws value label above each bar
 */
const drawBarValueLabel = (value: number, x: number, y: number, width: number): void => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(chartColors.textPrimary[0], chartColors.textPrimary[1], chartColors.textPrimary[2]);
  
  const formattedValue = formatCurrencyCompact(value);
  const textWidth = doc.getTextWidth(formattedValue);
  const centerX = x + width / 2 - textWidth / 2;
  
  // Add white background with slight padding for better readability
  const padding = 1.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(chartColors.gridLight[0], chartColors.gridLight[1], chartColors.gridLight[2]);
  doc.setLineWidth(0.2);
  doc.rect(centerX - padding, y - 12, textWidth + padding * 2, 8, 'FD');
  
  doc.text(formattedValue, centerX, y - 6);
};

/**
 * Draws X-axis labels (month names)
 */
const drawXAxisLabels = (data: MonthlyData[], config: ChartConfig): void => {
  const metrics = calculateChartMetrics(data, config);
  const chartEndY = config.y + config.topPadding + metrics.effectiveHeight;
  const axisStartX = config.x + config.leftPadding;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(chartColors.textSecondary[0], chartColors.textSecondary[1], chartColors.textSecondary[2]);
  
  data.forEach((item, index) => {
    const barX = axisStartX + (metrics.totalBarWidth * index) + (metrics.barSpacing / 2);
    const centerX = barX + metrics.actualBarWidth / 2;
    const monthWidth = doc.getTextWidth(item.month);
    
    doc.text(
      item.month, 
      centerX - monthWidth / 2, 
      chartEndY + 18 // Tambah jarak dari 15 ke 18
    );
  });
};

/**
 * Draws message when no data is available
 */
const drawNoDataMessage = (): void => {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(chartColors.textMuted[0], chartColors.textMuted[1], chartColors.textMuted[2]);
  doc.text('Tidak ada data penjualan untuk ditampilkan', PAGE_MARGIN, currentY);
  currentY += 30;
};

/**
 * Formats currency values for chart display (shortened version)
 */
const formatCurrencyShort = (value: number): string => {
  if (value === 0) return '0';
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}M`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  } else if (value >= 1000) {
    return `${Math.round(value / 1000)}rb`;
  }
  return `${Math.round(value)}`;
};

/**
 * Formats currency values in compact format for bar labels
 */
const formatCurrencyCompact = (value: number): string => {
  if (value === 0) return '0';
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  } else if (value >= 1000) {
    return `${Math.round(value / 1000)}rb`;
  }
  return `${Math.round(value)}`;
};

// Type definitions for better code structure
interface ChartConfig {
  width: number;
  height: number;
  x: number;
  y: number;
  barSpacing: number;
  gridLines: number;
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
}

interface ChartMetrics {
  maxValue: number;
  barCount: number;
  totalBarWidth: number;
  barSpacing: number;
  actualBarWidth: number;
  paddedMaxValue: number;
  effectiveHeight: number;
}

interface MonthlyData {
  month: string;
  total: number;
}

// Constants for better maintainability
const PAGE_MARGIN = 30;

// Enhanced color scheme untuk chart
const chartColors = {
  primaryDark: [33, 37, 41] as [number, number, number],
  textPrimary: [33, 37, 41] as [number, number, number],
  textSecondary: [108, 117, 125] as [number, number, number],
  textMuted: [134, 142, 150] as [number, number, number],
  chartPrimary: [255, 193, 7] as [number, number, number], // Warm yellow/orange
  chartPrimaryDark: [255, 171, 0] as [number, number, number],
  chartHighlight: [255, 235, 156] as [number, number, number],
  borderPrimary: [206, 212, 218] as [number, number, number],
  gridLight: [233, 236, 239] as [number, number, number]
};

// ==================== DATA TABLE ====================
const drawDataTable = (): void => {
  doc.addPage();         
  currentY = 30; 

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;
  const availableWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  addSpacing(20);
  doc.text('Detailed Purchase Order Data', margin, currentY);
  addSpacing(25);

  // Prepare table data
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

  // === Dynamic Column Width ===
  const fixedColumns: Record<number, number> = {
    0: 25, // No
    1: 35, // Group
    2: 80  // Name
  };

  const fixedTotal = fixedColumns[0] + fixedColumns[1] + fixedColumns[2];
  const flexibleCols = 17 - 3; // 14 kolom
  const remainingWidth = availableWidth - fixedTotal;
  const flexibleWidth = remainingWidth / flexibleCols;

  const columnStyles: Record<number, any> = {
    0: { halign: 'center', cellWidth: fixedColumns[0] },
    1: { halign: 'center', cellWidth: fixedColumns[1] },
    2: { halign: 'left',   cellWidth: fixedColumns[2] }
  };

  for (let i = 3; i <= 16; i++) {
    columnStyles[i] = { halign: 'right', cellWidth: flexibleWidth };
  }

  // === AutoTable ===
  (autoTable as any)(doc, {
    head: [[
      'No', 'Group', 'Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total Qty', 'Total Sales'
    ]],
    body: tableData,
    startY: currentY,
    theme: 'striped',
    styles: {
      fontSize: availableWidth < 800 ? 7 : 8, // shrink font kalau sempit
      cellPadding: 3,
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
      fontSize: availableWidth < 800 ? 8 : 9
    },
    columnStyles: columnStyles,
    alternateRowStyles: {
      fillColor: colors.light
    },
    margin: { top: 30, left: margin, right: margin, bottom: 40 },
    pageBreak: 'auto',
    showHead: 'everyPage',
    didDrawCell: function(data: any) {
      if (data.column.index === 1 && data.section === 'body') {
        const group = data.cell.text[0];
        if (group in colors.groups) {
          const groupColor = getGroupColor(group);
          doc.setFillColor(groupColor[0], groupColor[1], groupColor[2]);
          doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text(group, data.cell.x + data.cell.width/2, data.cell.y + data.cell.height/2 + 2, { align: 'center' });
        }
      }
    },
    didDrawPage: function(data: any) {
      const pageNumber = data.pageNumber;
      const totalPages = doc.getNumberOfPages();

      // Footer line
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

      // Company name
      doc.setFontSize(8);
      doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('PT. Rame Rekaguna Prakarsa - Purchase Order Report', margin, pageHeight - 15);

      // Page number
      const pageText = `Page ${pageNumber} of ${totalPages}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 15);
    }
  });
};

  // ==================== MAIN EXECUTION ====================
  try {
    drawHeader();
    drawSummaryCards();
    drawGroupPerformance();
    drawGroupPerformanceChart();
    drawMonthlyChart();
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
                ðŸ’¡ Klik target di group cards untuk mengedit
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
                ðŸ’¡ Total quantity dari semua PO
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
                  {group !== 'A' && group !== 'B' && group !== 'C' && group !== 'D' && group !== 'Other' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRemoveGroup(group)}
                      disabled={crudLoading}
                    >
                      Hapus
                    </Button>
                  )}
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
