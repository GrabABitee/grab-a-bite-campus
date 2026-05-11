import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminMenu() {

  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [timings, setTimings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  const cafeteriaId = localStorage.getItem("cafeteriaId");

  /* ================= LOAD ================= */

  useEffect(() => {
    loadMenu();
    loadTimings();
    loadCafeteria();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await api.getMenu(cafeteriaId!);
      setMenuItems(data);
    } catch {
      toast({ title: "Failed to load menu", variant: "destructive" });
    }
  };

  const loadTimings = async () => {
    try {
      const data = await api.getTimings(cafeteriaId!);
      setTimings(data || {});
    } catch {}
  };

  const loadCafeteria = async () => {
    try {
      const data = await api.getCafeteria(cafeteriaId!);
      setIsAcceptingOrders(data.isAcceptingOrders);
    } catch {}
  };

  /* ================= KITCHEN TOGGLE ================= */

  const toggleKitchen = async () => {

    const confirm = window.confirm(
      isAcceptingOrders
        ? "Stop accepting new orders?"
        : "Start accepting orders?"
    );

    if (!confirm) return;

    try {
      await api.toggleKitchen(cafeteriaId!);

      setIsAcceptingOrders(prev => !prev);

      toast({
        title: isAcceptingOrders
          ? "Kitchen Closed 🔴"
          : "Kitchen Open 🟢",
      });

    } catch {
      toast({
        title: "Failed to toggle kitchen",
        variant: "destructive",
      });
    }
  };

  /* ================= ITEM TOGGLE ================= */

  const toggleAvailability = async (item: any) => {
    try {
      await api.updateMenuItem(item.menuItemId, {
        isAvailable: !item.isAvailable, // ✅ FIXED
      });

      setMenuItems(prev =>
        prev.map(i =>
          i.menuItemId === item.menuItemId
            ? { ...i, isAvailable: !i.isAvailable }
            : i
        )
      );

    } catch {
      toast({
        title: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  /* ================= TIMING CHANGE ================= */

  const updateTimingField = (meal: string, field: string, value: string) => {
    setTimings(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value
      }
    }));
  };

  /* ================= SAVE TIMINGS ================= */

  const saveTimings = async () => {
    try {
      setLoading(true);

      await api.updateTimings(cafeteriaId!, timings);

      toast({ title: "Timings saved ✅" });

    } catch {
      toast({
        title: "Failed to save timings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUP ================= */

  const groupByMeal = (meal: string) => {
    return menuItems.filter(item =>
      item.mealTypes?.includes(meal)
    );
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Menu Management</h1>

      {/* 🔥 KITCHEN CONTROL */}
      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">Kitchen Control</h2>

        <Button
          onClick={toggleKitchen}
          className={`${
            isAcceptingOrders ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {isAcceptingOrders ? "🟢 Accepting Orders" : "🔴 Kitchen Closed"}
        </Button>
      </div>

      <Tabs defaultValue="timings">

        <TabsList>
          <TabsTrigger value="timings">Order Timings</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="schedule">Meal Schedule</TabsTrigger>
        </TabsList>

        {/* ================= TIMINGS ================= */}
        <TabsContent value="timings">

          <div className="grid grid-cols-2 gap-4">

            {["BREAKFAST", "LUNCH", "DINNER", "SNACKS"].map(meal => (

              <Card key={meal}>
                <CardContent className="p-4 space-y-2">

                  <h3 className="font-semibold">{meal}</h3>

                  <Input
                    type="time"
                    value={timings?.[meal]?.start || ""}
                    onChange={(e) =>
                      updateTimingField(meal, "start", e.target.value)
                    }
                  />

                  <Input
                    type="time"
                    value={timings?.[meal]?.end || ""}
                    onChange={(e) =>
                      updateTimingField(meal, "end", e.target.value)
                    }
                  />

                  <Input
                    type="time"
                    value={timings?.[meal]?.cutoff || ""}
                    onChange={(e) =>
                      updateTimingField(meal, "cutoff", e.target.value)
                    }
                  />

                </CardContent>
              </Card>

            ))}

          </div>

          <Button onClick={saveTimings} className="mt-4">
            {loading ? "Saving..." : "Save Timings"}
          </Button>

        </TabsContent>

        {/* ================= ITEMS ================= */}
        <TabsContent value="items">

          <div className="space-y-4">

            {menuItems.map(item => (

              <Card key={item.menuItemId}>
                <CardContent className="p-4 flex justify-between items-center">

                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price}
                    </p>
                  </div>

                  <Switch
                    checked={item.isAvailable}
                    onCheckedChange={() => toggleAvailability(item)}
                  />

                </CardContent>
              </Card>

            ))}

          </div>

        </TabsContent>

        {/* ================= SCHEDULE ================= */}
        <TabsContent value="schedule">

          <div className="grid grid-cols-3 gap-4">

            {["BREAKFAST", "LUNCH", "DINNER"].map(meal => (

              <Card key={meal}>
                <CardContent className="p-4 space-y-2">

                  <h3 className="font-bold">{meal}</h3>

                  {groupByMeal(meal).map(item => (
                    <div key={item.menuItemId} className="text-sm">
                      {item.name} — ₹{item.price}
                    </div>
                  ))}

                </CardContent>
              </Card>

            ))}

          </div>

        </TabsContent>

      </Tabs>

    </div>
  );
}