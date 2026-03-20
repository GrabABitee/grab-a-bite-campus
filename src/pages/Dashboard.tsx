import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FoodCard } from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Upload, Sparkles, Clock } from "lucide-react";
import { api } from "@/lib/api";

import burgerImg from "@/assets/food-burger.jpg";
import saladImg from "@/assets/food-salad.jpg";
import pastaImg from "@/assets/food-pasta.jpg";
import sandwichImg from "@/assets/food-sandwich.jpg";

const categories = ["All", "Main Course", "South Indian", "North Indian", "Rice", "Snacks", "Street Food", "Beverages"];

export default function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ------------------------------- */
  /* Load User + Menu */
  /* ------------------------------- */

  useEffect(() => {

    const loadData = async () => {
      try {

        const userData = await api.getCurrentUser();

        // onboarding protection
        if (!userData.collegeId || !userData.cafeteriaId) {
          navigate("/onboarding");
          return;
        }

        setUser(userData);

        // fetch menu for cafeteria
        const menu = await api.getMenu(userData.cafeteriaId);

        setMenuItems(menu);

      } catch (error) {
        navigate("/");
      }
    };

    loadData();

  }, [navigate]);

  /* ------------------------------- */
  /* Filtering */
  /* ------------------------------- */

  const filteredItems = menuItems.filter((item) => {

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });

  const handleAddToCart = (item: any, quantity: number) => {
    console.log(`Added ${quantity} ${item.name}`);
  };

  if (!user) return null;

  const collegeId = user.collegeId;
  const cafeteriaId = user.cafeteriaId;

  return (
    <div className="space-y-4 max-w-lg mx-auto px-4 py-2">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl p-4 border border-primary/20">
        <div className="space-y-3">
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {user.name || "Student"} 👋
            </h1>

            <p className="text-sm text-muted-foreground">
              Ready to grab a bite?
            </p>

            <div className="flex flex-col gap-2 mt-2 text-xs text-muted-foreground">

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Open until 9:00 PM</span>
              </div>

              <Badge variant="secondary" className="bg-success/10 text-success text-xs w-fit">
                {cafeteriaId} • {collegeId}
              </Badge>

            </div>
          </div>

          <div className="flex gap-2">

            <Button variant="outline" size="sm" className="gap-2 flex-1 text-xs">
              <Upload className="h-3 w-3" />
              Scan Food
            </Button>

            <Button variant="food" size="sm" className="gap-2 flex-1 text-xs">
              <Sparkles className="h-3 w-3" />
              AI Picks
            </Button>

          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">

        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-primary">12</div>
          <p className="text-xs text-muted-foreground">Orders</p>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-success">₹240</div>
          <p className="text-xs text-muted-foreground">Saved</p>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-lg font-bold">4.8</div>
          <p className="text-xs text-muted-foreground">Rating</p>
        </Card>

      </div>

      {/* Search */}
      <div className="space-y-4">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search for food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />

        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>

          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1">

            {categories.map((category) => (

              <TabsTrigger key={category} value={category} className="text-xs">

                {category === "Main Course"
                  ? "Main"
                  : category === "South Indian"
                  ? "South"
                  : category === "North Indian"
                  ? "North"
                  : category === "Street Food"
                  ? "Street"
                  : category}

              </TabsTrigger>

            ))}

          </TabsList>

        </Tabs>

      </div>

      {/* Menu */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold">
            Today's Menu
          </h2>

          <Badge variant="outline" className="text-xs">
            {filteredItems.length} items available
          </Badge>

        </div>

        {filteredItems.length > 0 ? (

          <div className="space-y-3">

            {filteredItems.map((item) => (

              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />

            ))}

          </div>

        ) : (

          <div className="text-center py-12">

            <p className="text-muted-foreground mb-2">
              No items found
            </p>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>

          </div>

        )}

      </div>

    </div>
  );
}