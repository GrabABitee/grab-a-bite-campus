import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, ShoppingBag } from "lucide-react";

export default function Analytics() {
  const salesData = [
    { name: 'Mon', orders: 45, revenue: 2250 },
    { name: 'Tue', orders: 52, revenue: 2860 },
    { name: 'Wed', orders: 38, revenue: 1950 },
    { name: 'Thu', orders: 61, revenue: 3250 },
    { name: 'Fri', orders: 73, revenue: 3950 },
    { name: 'Sat', orders: 35, revenue: 1850 },
    { name: 'Sun', orders: 28, revenue: 1520 }
  ];

  const menuItemsData = [
    { name: 'Masala Dosa', value: 25, color: '#ff6b35' },
    { name: 'Chole Bhature', value: 20, color: '#f7931e' },
    { name: 'Biryani', value: 18, color: '#ffd700' },
    { name: 'Rajma Rice', value: 15, color: '#7cb342' },
    { name: 'Others', value: 22, color: '#42a5f5' }
  ];

  const hourlyData = [
    { hour: '8AM', orders: 12 },
    { hour: '9AM', orders: 18 },
    { hour: '10AM', orders: 8 },
    { hour: '11AM', orders: 5 },
    { hour: '12PM', orders: 25 },
    { hour: '1PM', orders: 35 },
    { hour: '2PM', orders: 28 },
    { hour: '3PM', orders: 15 },
    { hour: '4PM', orders: 10 },
    { hour: '5PM', orders: 8 },
    { hour: '6PM', orders: 22 },
    { hour: '7PM', orders: 18 }
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,250",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "332",
      change: "+8.1%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Active Students",
      value: "127",
      change: "-2.4%",
      trend: "down",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Avg Order Time",
      value: "18 min",
      change: "-5.2%",
      trend: "up",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const topItems = [
    { name: "Masala Dosa", orders: 85, revenue: "₹5,100" },
    { name: "Chole Bhature", orders: 67, revenue: "₹5,360" },
    { name: "Biryani", orders: 58, revenue: "₹8,700" },
    { name: "Rajma Rice", orders: 52, revenue: "₹4,940" },
    { name: "Paneer Butter Masala", orders: 45, revenue: "₹6,300" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your cafeteria performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${stat.color.split('-')[1]}-500/20 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={`flex items-center text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#ff6b35" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={menuItemsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {menuItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Orders and Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hourly Order Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#ff6b35" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.revenue}</p>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}