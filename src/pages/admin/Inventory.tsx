import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Package, AlertTriangle, TrendingDown, Plus } from "lucide-react";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const mockInventory = [
    {
      id: 1,
      name: "Rice (Basmati)",
      category: "Grains",
      currentStock: 50,
      minStock: 20,
      unit: "kg",
      pricePerUnit: 80,
      supplier: "Local Supplier",
      lastRestocked: "2 days ago",
      status: "In Stock"
    },
    {
      id: 2,
      name: "Paneer",
      category: "Dairy",
      currentStock: 8,
      minStock: 10,
      unit: "kg",
      pricePerUnit: 300,
      supplier: "Dairy Farm Co.",
      lastRestocked: "1 day ago",
      status: "Low Stock"
    },
    {
      id: 3,
      name: "Onions",
      category: "Vegetables",
      currentStock: 25,
      minStock: 15,
      unit: "kg",
      pricePerUnit: 40,
      supplier: "Vegetable Market",
      lastRestocked: "3 days ago",
      status: "In Stock"
    },
    {
      id: 4,
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 5,
      minStock: 10,
      unit: "kg",
      pricePerUnit: 60,
      supplier: "Vegetable Market",
      lastRestocked: "4 days ago",
      status: "Low Stock"
    },
    {
      id: 5,
      name: "Wheat Flour",
      category: "Grains",
      currentStock: 0,
      minStock: 25,
      unit: "kg",
      pricePerUnit: 45,
      supplier: "Grain Distributor",
      lastRestocked: "1 week ago",
      status: "Out of Stock"
    },
    {
      id: 6,
      name: "Cooking Oil",
      category: "Oils",
      currentStock: 15,
      minStock: 8,
      unit: "L",
      pricePerUnit: 120,
      supplier: "Oil Company",
      lastRestocked: "5 days ago",
      status: "In Stock"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-500";
      case "Low Stock": return "bg-yellow-500";
      case "Out of Stock": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredInventory = mockInventory.filter(item => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = mockInventory.length;
  const lowStockItems = mockInventory.filter(item => item.status === "Low Stock").length;
  const outOfStockItems = mockInventory.filter(item => item.status === "Out of Stock").length;
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your ingredient stock levels</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="food">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="Enter item name" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input id="currentStock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock Level</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="kg, L, pieces" />
                </div>
                <div>
                  <Label htmlFor="price">Price per Unit (₹)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Enter supplier name" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="food" className="flex-1">
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Grains">Grains</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Oils">Oils</SelectItem>
                <SelectItem value="Spices">Spices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge className={`${getStatusColor(item.status)} text-white`}>
                    {item.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className="text-xl font-bold">
                      {item.currentStock} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min Stock</p>
                    <p className="text-xl font-bold">
                      {item.minStock} {item.unit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price per {item.unit}</p>
                    <p className="font-medium">₹{item.pricePerUnit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">₹{(item.currentStock * item.pricePerUnit).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Supplier: {item.supplier}</p>
                  <p className="text-sm text-muted-foreground">Last restocked: {item.lastRestocked}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Restock
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}