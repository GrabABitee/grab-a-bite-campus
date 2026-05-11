import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import {
  Clock3,
  ChefHat,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

export default function AdminOrders() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 15000);

    return () => clearInterval(interval);

  }, []);

  const loadOrders = async () => {

    try {

      const response = await api.get("/orders");

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      const sorted = [...data].sort((a, b) => {

        const priority: any = {
          PENDING: 1,
          PREPARING: 2,
          READY_FOR_PICKUP: 3,
          COMPLETED: 4,
        };

        return priority[a.status] - priority[b.status];
      });

      setOrders(sorted);

    } catch (error) {

      console.log("LOAD ERROR:", error);

      setOrders([]);

    } finally {

      setLoading(false);

    }
  };

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {

    try {

      await api.patch(
        `/orders/${orderId}/status`,
        { status }
      );

      loadOrders();

    } catch (error) {

      console.log(
        "STATUS UPDATE ERROR:",
        error
      );
    }
  };

  const pending = orders.filter(
    (o) => o.status === "PENDING"
  ).length;

  const preparing = orders.filter(
    (o) => o.status === "PREPARING"
  ).length;

  const ready = orders.filter(
    (o) => o.status === "READY_FOR_PICKUP"
  ).length;

  const completed = orders.filter(
    (o) => o.status === "COMPLETED"
  ).length;

  const getStatusColor = (status: string) => {

    switch (status) {

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "PREPARING":
        return "bg-orange-100 text-orange-700";

      case "READY_FOR_PICKUP":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-slate-200 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {

    return (
      <div className="p-10 text-lg">
        Loading orders...
      </div>
    );
  }

  return (

    <div className="h-screen overflow-y-auto bg-[#f6f8fb] p-6">

      {/* HEADER */}

      <div className="sticky top-0 z-20 bg-[#f6f8fb] pb-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Order Management
            </h1>

            <p className="text-slate-500 mt-1">
              Live cafeteria orders
            </p>

            <p className="text-xs text-green-600 mt-2">
              ● Auto refreshing every 15 seconds
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {pending}
                </h2>

              </div>

              <Clock3 className="text-yellow-500" />

            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Preparing
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {preparing}
                </h2>

              </div>

              <ChefHat className="text-orange-500" />

            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Ready
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {ready}
                </h2>

              </div>

              <PackageCheck className="text-green-500" />

            </div>

          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {completed}
                </h2>

              </div>

              <CheckCircle2 className="text-slate-500" />

            </div>

          </div>

        </div>

      </div>

      {/* EMPTY */}

      {orders.length === 0 && (

        <div className="bg-white border rounded-3xl p-12 text-center text-slate-500 shadow-sm">

          🍔 No active cafeteria orders right now

        </div>

      )}

      {/* ORDER GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

        {orders.map((order) => (

          <div
            key={order.orderId}
            className="
            bg-white
            rounded-3xl
            border
            shadow-sm
            overflow-hidden
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            "
          >

            {/* TOP */}

            <div className="border-b px-5 py-4 flex justify-between items-start">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  {order.studentName}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  #{order.orderId}
                </p>

              </div>

              <div
                className={`
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                flex
                items-center
                gap-2
                ${getStatusColor(order.status)}
                `}
              >

                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>

                {order.status}

              </div>

            </div>

            {/* BODY */}

            <div className="p-5 space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs text-slate-400">
                    Pickup Code
                  </p>

                  <p className="font-bold text-xl">
                    {order.pickupCode}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Total
                  </p>

                  <p className="font-bold text-xl">
                    ₹{order.totalAmount}
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs text-slate-400 mb-1">
                  Cafeteria
                </p>

                <p className="font-medium">
                  {order.cafeteriaName}
                </p>

              </div>

              {/* ITEMS */}

              <div>

                <p className="text-xs text-slate-400 mb-3">
                  Items
                </p>

                <div className="space-y-3">

                  {order.items?.map(
                    (item: any, index: number) => (

                      <div
                        key={index}
                        className="bg-slate-50 rounded-2xl p-3 flex gap-3 items-center"
                      >

                        <img
                          src={
                            item.imageUrl ||
                            "https://placehold.co/100"
                          }
                          alt={item.itemName}
                          className="w-14 h-14 rounded-xl object-cover"
                        />

                        <div>

                          <p className="font-semibold text-sm">
                            {item.itemName}
                          </p>

                          <p className="text-xs text-slate-500">
                            Quantity: {item.quantity}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* BUTTONS */}

              {order.status === "PENDING" && (

                <button
                  onClick={() =>
                    updateStatus(
                      order.orderId,
                      "PREPARING"
                    )
                  }
                  className="
                  w-full
                  bg-gradient-to-r
                  from-blue-500
                  to-blue-600
                  hover:from-blue-600
                  hover:to-blue-700
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  transition
                  "
                >
                  Start Preparing
                </button>

              )}

              {order.status === "PREPARING" && (

                <button
                  onClick={() =>
                    updateStatus(
                      order.orderId,
                      "READY_FOR_PICKUP"
                    )
                  }
                  className="
                  w-full
                  bg-gradient-to-r
                  from-orange-500
                  to-orange-600
                  hover:from-orange-600
                  hover:to-orange-700
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  transition
                  "
                >
                  Mark Ready
                </button>

              )}

              {order.status === "READY_FOR_PICKUP" && (

                <button
                  onClick={() =>
                    updateStatus(
                      order.orderId,
                      "COMPLETED"
                    )
                  }
                  className="
                  w-full
                  bg-gradient-to-r
                  from-green-500
                  to-green-600
                  hover:from-green-600
                  hover:to-green-700
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  transition
                  "
                >
                  Complete Order
                </button>

              )}

              {order.status === "COMPLETED" && (

                <div className="bg-slate-100 text-slate-500 text-center py-3 rounded-2xl font-medium">

                  Order Completed

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}