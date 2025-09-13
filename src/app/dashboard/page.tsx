"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from '@/components/ui/chart';

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
      const result = await response.json();
      
      if (response.ok) {
        // Transform database data to match our interface
        const transformedData = result.map((item: any, index: number) => ({
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
        setData(transformedData);
      } else {
        // Fallback to sample data if API fails
        setData(sampleData);
      }
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

  const handleCellEdit = (rowIndex: number, column: string, currentValue: number) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(currentValue.toString());
  };

  const handleCellSave = async () => {
    if (editingCell) {
      const newData = [...data];
      
      if (editingCell.col === 'name') {
        // Handle name editing
        newData[editingCell.row].name = editValue;
      } else if (editingCell.col === 'group') {
        // Handle group changing
        newData[editingCell.row].group = editValue;
        // Update target group based on new group
        newData[editingCell.row].targetGroup = groupTargets[editValue] || 0;
      } else {
        // Handle numeric value editing
        const numericValue = parseFloat(editValue) || 0;
        (newData[editingCell.row] as any)[editingCell.col] = numericValue;
        
        // Recalculate totals
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
      }
      
      setData(newData);
      
      // Save to database
      try {
        const rowData = newData[editingCell.row];
        const requestBody: any = {
          name: rowData.name,
          group_name: rowData.group,
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
          targetGroup: rowData.targetGroup
        };

        // Add original values if this is a name or group change
        if (originalValues && (editingCell.col === 'name' || editingCell.col === 'group')) {
          requestBody.originalName = originalValues.name;
          requestBody.originalGroup = originalValues.group;
        }

        await fetch('/api/purchase-orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
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
    setEditingCell({ row: rowIndex, col: 'group' });
    setEditValue(currentGroup);
    setOriginalValues({ name: data[rowIndex].name, group: currentGroup });
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
        const groupMembers = newData.filter(item => item.group === editingTarget);
        for (const member of groupMembers) {
          await fetch('/api/purchase-orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: member.name,
              group_name: member.group,
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
            }),
          });
        }
      } catch (error) {
        console.error('Error saving target:', error);
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

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    
    // Title
    doc.setFontSize(16);
    doc.text('Purchase Order by Order Control 2025 PT. Rame Rekaguna Prakarsa', 14, 15);
    
    // Table data
    const tableData = data.map(item => [
      item.no,
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
      item.totalQtyPO,
      formatCurrency(item.totalValueSales),
      item.group,
      formatCurrency(item.targetGroup || 0),
      item.targetGroup ? ((item.totalValueSales / item.targetGroup) * 100).toFixed(2) + '%' : '0%'
    ]);
    
    doc.autoTable({
      head: [['No', 'Name', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Total Qty PO', 'Total Value Sales', 'Group', 'Target Group', 'Achievement %']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    doc.save('Purchase_Order_2025.pdf');
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
              <Button onClick={() => setShowAddGroupModal(true)} variant="outline">
                Tambah Group
              </Button>
              <Button onClick={exportToExcel} variant="outline">
                Export Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline">
                Export PDF
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <CardTitle>Purchase Order Data</CardTitle>
            <CardDescription>
              Klik pada cell untuk mengedit data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-lg">Loading data...</div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 px-2 py-1 text-left">No</th>
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
                    <th className="border border-gray-300 px-2 py-1 text-center">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 px-2 py-1 text-center">{row.no}</td>
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
                      <td className="border border-gray-300 px-2 py-1 text-right">{row.totalQtyPO}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                        {formatCurrency(row.totalValueSales)}
                      </td>
                      <td 
                        className="border border-gray-300 px-2 py-1 text-center cursor-pointer hover:bg-blue-100"
                        onClick={() => handleGroupEdit(rowIndex, row.group)}
                      >
                        {editingCell?.row === rowIndex && editingCell?.col === 'group' ? (
                          <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
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
    </div>
  );
}
