import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sparkles } from "lucide-react";

export default function AIPicks() {

  const [menu, setMenu] = useState<any[]>([]);

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

  /* ============================= */
  /* AI LOGIC (FRONTEND ONLY) */
  /* ============================= */

  const budgetMeals = menu.filter(
    (item) => item.price <= 100
  );

  const premiumMeals = menu.filter(
    (item) => item.price > 200
  );

  const trendingMeals = [...menu]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="flex items-center gap-3">

          <div className="bg-orange-100 p-3 rounded-xl">
            <Sparkles className="text-orange-500" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI Picks
            </h1>

            <p className="text-gray-500">
              Smart recommendations for you
            </p>
          </div>

        </div>

        {/* BUDGET */}

        <section className="space-y-4">

          <h2 className="text-xl font-bold">
            Budget Meals Under ₹100
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {budgetMeals.map((item) => (

              <div
                key={item.menuItemId}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border"
              >

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-44 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>

                  <p className="text-orange-500 font-bold text-xl mt-3">
                    ₹{item.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* TRENDING */}

        <section className="space-y-4">

          <h2 className="text-xl font-bold">
            Trending Today 🔥
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {trendingMeals.map((item) => (

              <div
                key={item.menuItemId}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border"
              >

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-orange-500 font-bold mt-2">
                    ₹{item.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* PREMIUM */}

        <section className="space-y-4">

          <h2 className="text-xl font-bold">
            Premium Picks ✨
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {premiumMeals.map((item) => (

              <div
                key={item.menuItemId}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border"
              >

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-44 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-orange-500 font-bold mt-2 text-xl">
                    ₹{item.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}