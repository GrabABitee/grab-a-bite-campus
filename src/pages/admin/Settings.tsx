import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Clock, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Mail,
  Phone,
  MapPin,
  Save
} from "lucide-react";

export default function Settings() {
  const [kitchenHours, setKitchenHours] = useState({
    openTime: "07:00",
    closeTime: "22:00",
    breakStart: "15:00",
    breakEnd: "16:00"
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    dailyReports: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const [cafeInfo, setCafeInfo] = useState({
    cafeName: "Main Campus Café",
    contactNumber: "+91 98765 43210",
    email: "cafe@college.edu",
    address: "Academic Block A, Ground Floor",
    orderCutoffTime: "21:30"
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your cafeteria preferences and configurations</p>
        </div>
        <Button variant="food">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cafeteria Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Cafeteria Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cafeName">Cafeteria Name</Label>
              <Input
                id="cafeName"
                value={cafeInfo.cafeName}
                onChange={(e) => setCafeInfo({...cafeInfo, cafeName: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="contactNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                value={cafeInfo.contactNumber}
                onChange={(e) => setCafeInfo({...cafeInfo, contactNumber: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={cafeInfo.email}
                onChange={(e) => setCafeInfo({...cafeInfo, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                value={cafeInfo.address}
                onChange={(e) => setCafeInfo({...cafeInfo, address: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={kitchenHours.openTime}
                  onChange={(e) => setKitchenHours({...kitchenHours, openTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={kitchenHours.closeTime}
                  onChange={(e) => setKitchenHours({...kitchenHours, closeTime: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breakStart">Break Start</Label>
                <Input
                  id="breakStart"
                  type="time"
                  value={kitchenHours.breakStart}
                  onChange={(e) => setKitchenHours({...kitchenHours, breakStart: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="breakEnd">Break End</Label>
                <Input
                  id="breakEnd"
                  type="time"
                  value={kitchenHours.breakEnd}
                  onChange={(e) => setKitchenHours({...kitchenHours, breakEnd: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="orderCutoff">Order Cutoff Time</Label>
              <Input
                id="orderCutoff"
                type="time"
                value={cafeInfo.orderCutoffTime}
                onChange={(e) => setCafeInfo({...cafeInfo, orderCutoffTime: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Orders will not be accepted after this time
              </p>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Current Status:</p>
              <Badge variant="default" className="bg-green-500">
                Kitchen Open
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newOrders">New Order Alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified when new orders arrive</p>
              </div>
              <Switch
                id="newOrders"
                checked={notifications.newOrders}
                onCheckedChange={(checked) => setNotifications({...notifications, newOrders: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowStock">Low Stock Alerts</Label>
                <p className="text-xs text-muted-foreground">Alert when inventory is running low</p>
              </div>
              <Switch
                id="lowStock"
                checked={notifications.lowStock}
                onCheckedChange={(checked) => setNotifications({...notifications, lowStock: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dailyReports">Daily Reports</Label>
                <p className="text-xs text-muted-foreground">Receive daily sales summaries</p>
              </div>
              <Switch
                id="dailyReports"
                checked={notifications.dailyReports}
                onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="changePassword">Change Password</Label>
              <div className="flex gap-2">
                <Input
                  id="changePassword"
                  type="password"
                  placeholder="Enter new password"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  <Badge variant="outline" className="mt-1">Not Enabled</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Data Export</Label>
              <p className="text-sm text-muted-foreground mb-2">Download your cafeteria data</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export Orders
                </Button>
                <Button variant="outline" size="sm">
                  Export Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="inr">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="usd">US Dollar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}