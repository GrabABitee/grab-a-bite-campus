import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function StudentMenu() {

  const [menu, setMenu] = useState<any[]>([]);
  const [mealType, setMealType] = useState("BREAKFAST");

  const { addToCart, cart } = useCart();

  const mealTypes = [
    "BREAKFAST",
    "LUNCH",
    "DINNER",
  ];

  /* ===================================== */
  /* LOAD MENU */
  /* ===================================== */

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {

    try {

      const cafeteriaId =
        localStorage.getItem("cafeteriaId");

      const data = await api.get(
        `/menu-items/cafeteria/${cafeteriaId}`
      );

      setMenu(data);

    } catch (err) {
      console.log(err);
    }
  };

  /* ===================================== */
  /* FILTER BY MEAL TYPE */
  /* ===================================== */

  const filtered = menu.filter((item) => {

    if (!item.mealTypes) return false;

    return item.mealTypes.includes(mealType);
  });

  /* ===================================== */
  /* UI */
  /* ===================================== */

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="sticky top-0 z-50 bg-white border-b px-4 py-4 shadow-sm">

        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Cafeteria Menu
            </h1>

            <p className="text-sm text-gray-500">
              Fresh meals available today
            </p>
          </div>

          {/* CART */}

          <div className="relative">

            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-xl"
              onClick={() => window.location.href = "/dashboard/cart"}
            >
              Cart
            </button>

            {cart.length > 0 && (

              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* TABS */}
      {/* ===================================== */}

      <div className="max-w-5xl mx-auto px-4 py-4">

        <div className="flex gap-3 overflow-x-auto pb-2">

          {mealTypes.map((type) => (

            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                mealType === type
                  ? "bg-orange-500 text-white"
                  : "bg-white border"
              }`}
            >
              {type}
            </button>

          ))}

        </div>

      </div>

      {/* ===================================== */}
      {/* MENU GRID */}
      {/* ===================================== */}

      <div className="max-w-5xl mx-auto px-4 pb-10">

        {filtered.length === 0 && (

          <div className="text-center py-20 text-gray-500">
            No items available
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {filtered.map((item) => (

            <div
              key={item.menuItemId}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition"
            >

              {/* IMAGE */}

              <div className="h-52 bg-gray-100 overflow-hidden">

                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* CONTENT */}

              <div className="p-4 space-y-3">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="font-bold text-lg">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>

                  </div>

                  <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Food
                  </div>

                </div>

                {/* PRICE */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-orange-500 text-2xl font-bold">
                      ₹{item.price}
                    </p>

                    {!item.isAvailable && (
                      <p className="text-xs text-red-500">
                        Out of stock
                      </p>
                    )}

                  </div>

                  {/* BUTTON */}

                  <button
                    disabled={!item.isAvailable}
                    onClick={() =>
                      addToCart({
                        menuItemId: item.menuItemId,
                        name: item.name,
                        price: item.price,
                        imageUrl: item.imageUrl,
                        quantity: 1,
                      })
                    }
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                      item.isAvailable
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    + Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}