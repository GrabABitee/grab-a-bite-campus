import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { Search, Trash2 } from "lucide-react";

import { api } from "@/lib/api";

export default function AdminStandardMenu() {

  const { toast } = useToast();

  const [standardItems, setStandardItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* ===================================== */
  /* LOAD STANDARD MENU */
  /* ===================================== */

  useEffect(() => {

    loadStandardMenu();

  }, []);

  const loadStandardMenu = async () => {

    try {

      const data = await api.getStandardMenuItems();

      setStandardItems(data);

    } catch (err) {

      console.error(err);

      toast({
        title: "Failed to load standard menu",
        variant: "destructive",
      });
    }
  };

  /* ===================================== */
  /* ADD ITEM */
  /* ===================================== */

  const addItem = (item: any) => {

    const exists = selectedItems.find(
      (i) => i.standardMenuItemId === item.standardMenuItemId
    );

    if (exists) {
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        standardMenuItemId: item.standardMenuItemId,

        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,

        price: "",

        breakfast: false,
        lunch: true,
        dinner: false,
      },
    ]);
  };

  /* ===================================== */
  /* REMOVE ITEM */
  /* ===================================== */

  const removeItem = (index: number) => {

    setSelectedItems(
      selectedItems.filter((_, i) => i !== index)
    );
  };

  /* ===================================== */
  /* SAVE MENU */
  /* ===================================== */

  const saveMenu = async () => {

    if (selectedItems.length === 0) {

      toast({
        title: "Select at least one item",
        variant: "destructive",
      });

      return;
    }

    const invalid = selectedItems.some(
      (item) => !item.price || Number(item.price) <= 0
    );

    if (invalid) {

      toast({
        title: "Please enter valid prices",
        variant: "destructive",
      });

      return;
    }

    setIsSaving(true);

    try {

      const payload = {
        items: selectedItems.map((item) => ({

          standardMenuItemId: item.standardMenuItemId,

          price: Number(item.price),

          mealTypes: [
            item.breakfast ? "BREAKFAST" : null,
            item.lunch ? "LUNCH" : null,
            item.dinner ? "DINNER" : null,
          ].filter(Boolean),
        })),
      };

      console.log("SENDING PAYLOAD:", payload);

      await api.createMenuItemsBulk(payload);

      toast({
        title: "Menu saved successfully",
      });

      setSelectedItems([]);

    } catch (err) {

      console.error(err);

      toast({
        title: "Failed to save menu",
        variant: "destructive",
      });

    } finally {

      setIsSaving(false);
    }
  };

  /* ===================================== */
  /* FILTER ITEMS */
  /* ===================================== */

  const filteredItems = standardItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">

      {/* ===================================== */}
      {/* LEFT SIDE */}
      {/* ===================================== */}

      <div className="lg:col-span-2 space-y-4">

        <div>

          <h1 className="text-3xl font-bold">
            Standard Menu
          </h1>

          <p className="text-muted-foreground mt-1">
            Add dishes to today's cafeteria menu
          </p>

        </div>

        {/* SEARCH */}

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search dishes..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {filteredItems.map((item) => (

            <Card
              key={item.standardMenuItemId}
              className="overflow-hidden border hover:shadow-xl transition-all duration-300 rounded-2xl"
            >

              {/* IMAGE */}

              <div className="h-48 overflow-hidden bg-muted">

                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />

              </div>

              {/* CONTENT */}

              <CardContent className="p-4 space-y-4">

                <div className="flex items-start justify-between gap-2">

                  <div>

                    <h2 className="font-semibold text-lg">
                      {item.name}
                    </h2>

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>

                  </div>

                  <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Food
                  </div>

                </div>

                <Button
                  className="w-full rounded-xl"
                  onClick={() => addItem(item)}
                >
                  + Add
                </Button>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

      {/* ===================================== */}
      {/* RIGHT SIDE */}
      {/* ===================================== */}

      <Card className="h-fit sticky top-4 rounded-2xl">

        <CardHeader>

          <CardTitle>
            Your Menu
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Configure dishes for today
          </p>

        </CardHeader>

        <CardContent className="space-y-4">

          {selectedItems.length === 0 && (

            <div className="text-center py-10 text-muted-foreground text-sm">
              No items selected
            </div>
          )}

          {selectedItems.map((item, index) => (

            <div
              key={index}
              className="border rounded-2xl p-4 bg-white shadow-sm space-y-4"
            >

              {/* TOP */}

              <div className="flex gap-3">

                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                </div>

              </div>

              {/* PRICE */}

              <Input
                type="number"
                placeholder="Enter Price"
                value={item.price}
                onChange={(e) => {

                  const updated = [...selectedItems];

                  updated[index].price = e.target.value;

                  setSelectedItems(updated);
                }}
              />

              {/* MEAL TYPES */}

              <div className="grid grid-cols-3 gap-2 text-sm">

                {/* BREAKFAST */}

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={item.breakfast}
                    onChange={(e) => {

                      const updated = [...selectedItems];

                      updated[index].breakfast =
                        e.target.checked;

                      setSelectedItems(updated);
                    }}
                  />

                  Breakfast

                </label>

                {/* LUNCH */}

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={item.lunch}
                    onChange={(e) => {

                      const updated = [...selectedItems];

                      updated[index].lunch =
                        e.target.checked;

                      setSelectedItems(updated);
                    }}
                  />

                  Lunch

                </label>

                {/* DINNER */}

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={item.dinner}
                    onChange={(e) => {

                      const updated = [...selectedItems];

                      updated[index].dinner =
                        e.target.checked;

                      setSelectedItems(updated);
                    }}
                  />

                  Dinner

                </label>

              </div>

            </div>

          ))}

          {/* SAVE */}

          <Button
            className="w-full rounded-xl"
            disabled={isSaving}
            onClick={saveMenu}
          >

            {isSaving ? "Saving..." : "Save Menu"}

          </Button>

        </CardContent>

      </Card>

    </div>
  );
}