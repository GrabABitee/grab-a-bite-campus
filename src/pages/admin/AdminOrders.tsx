import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

import {
  Clock3,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  LayoutGrid,
  Rows3,
  Filter,
} from "lucide-react";

export default function AdminOrders() {

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedStatus, setSelectedStatus] =
    useState("ACTIVE");

  const [gridCols, setGridCols] =
    useState(3);

  /*
  =========================================
  LOAD ORDERS
  =========================================
  */

  useEffect(() => {

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 15000);

    return () => clearInterval(interval);

  }, []);

  const loadOrders = async () => {

    try {

      const response =
        await api.get("/orders");

      const data =
        Array.isArray(response)
          ? response
          : response?.data || [];

      const sorted =
        [...data].sort((a, b) => {

          const priority: any = {
            PENDING: 1,
            PREPARING: 2,
            READY_FOR_PICKUP: 3,
            COMPLETED: 4,
          };

          return (
            priority[a.status] -
            priority[b.status]
          );
        });

      setOrders(sorted);

    } catch (error) {

      console.log(
        "LOAD ERROR:",
        error
      );

      setOrders([]);

    } finally {

      setLoading(false);
    }
  };

  /*
  =========================================
  UPDATE STATUS
  =========================================
  */

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

  /*
  =========================================
  COUNTS
  =========================================
  */

  const pending =
    orders.filter(
      (o) =>
        o.status === "PENDING"
    ).length;

  const preparing =
    orders.filter(
      (o) =>
        o.status === "PREPARING"
    ).length;

  const ready =
    orders.filter(
      (o) =>
        o.status ===
        "READY_FOR_PICKUP"
    ).length;

  const completed =
    orders.filter(
      (o) =>
        o.status ===
        "COMPLETED"
    ).length;

  /*
  =========================================
  FILTERED ORDERS
  =========================================
  */

  const filteredOrders =
    useMemo(() => {

      if (
        selectedStatus ===
        "ACTIVE"
      ) {

        return orders.filter(
          (o) =>
            o.status !==
            "COMPLETED"
        );
      }

      return orders.filter(
        (o) =>
          o.status ===
          selectedStatus
      );

    }, [
      orders,
      selectedStatus,
    ]);

  /*
  =========================================
  STATUS COLORS
  =========================================
  */

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "PENDING":

        return `
        bg-yellow-100
        text-yellow-700
        `;

      case "PREPARING":

        return `
        bg-orange-100
        text-orange-700
        `;

      case "READY_FOR_PICKUP":

        return `
        bg-green-100
        text-green-700
        `;

      case "COMPLETED":

        return `
        bg-slate-200
        text-slate-600
        `;

      default:

        return `
        bg-slate-100
        text-slate-600
        `;
    }
  };

  /*
  =========================================
  LOADING
  =========================================
  */

  if (loading) {

    return (

      <div className="p-10 text-lg">

        Loading orders...

      </div>
    );
  }

  return (

    <div className="
    h-screen
    overflow-y-auto
    bg-[#f6f8fb]
    p-6
    ">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="
      sticky
      top-0
      z-20
      bg-[#f6f8fb]
      pb-5
      ">

        <div className="
        flex
        items-start
        justify-between
        gap-6
        ">

          {/* LEFT */}

          <div>

            <h1 className="
            text-4xl
            font-bold
            text-slate-800
            ">
              Order Management
            </h1>

            <p className="
            text-slate-500
            mt-1
            ">
              Live cafeteria orders
            </p>

            {/* AUTO REFRESH + VIEW */}

            <div className="
            flex
            items-center
            gap-4
            mt-3
            flex-wrap
            ">

              <p className="
              text-xs
              text-green-600
              ">
                ● Auto refreshing every 15 seconds
              </p>

              {/* VIEW SWITCH */}

              <div className="
              flex
              items-center
              gap-2
              ">

                <div className="
                text-xs
                text-slate-500
                flex
                items-center
                gap-1
                ">
                  <LayoutGrid size={14} />
                  View
                </div>

                <button
                  onClick={() =>
                    setGridCols(3)
                  }
                  className={`
                  px-3
                  py-1.5
                  rounded-xl
                  border
                  text-sm
                  flex
                  items-center
                  gap-2
                  transition
                  ${
                    gridCols === 3
                      ? "bg-black text-white"
                      : "bg-white hover:bg-slate-100"
                  }
                  `}
                >

                  <Rows3 size={15} />

                  3

                </button>

                <button
                  onClick={() =>
                    setGridCols(5)
                  }
                  className={`
                  px-3
                  py-1.5
                  rounded-xl
                  border
                  text-sm
                  flex
                  items-center
                  gap-2
                  transition
                  ${
                    gridCols === 5
                      ? "bg-black text-white"
                      : "bg-white hover:bg-slate-100"
                  }
                  `}
                >

                  <LayoutGrid size={15} />

                  5

                </button>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="
          flex
          flex-col
          items-end
          gap-3
          ">

            {/* FILTERS */}

            <div className="
            flex
            items-center
            gap-2
            flex-wrap
            justify-end
            ">

              <div className="
              flex
              items-center
              gap-1
              text-slate-500
              text-sm
              mr-2
              ">

                <Filter size={15} />

                Filter

              </div>

              {[
                "ACTIVE",
                "PENDING",
                "PREPARING",
                "READY_FOR_PICKUP",
                "COMPLETED",
              ].map((status) => (

                <button
                  key={status}
                  onClick={() =>
                    setSelectedStatus(
                      status
                    )
                  }
                  className={`
                  px-4
                  py-2
                  rounded-2xl
                  text-sm
                  border
                  transition-all
                  ${
                    selectedStatus ===
                    status
                      ? `
                      bg-orange-500
                      text-white
                      border-orange-500
                      `
                      : `
                      bg-white
                      hover:bg-slate-100
                      `
                  }
                  `}
                >

                  {status.replace(
                    /_/g,
                    " "
                  )}

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* STATS */}
        {/* ========================================= */}

        <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
        mt-5
        ">

          {/* PENDING */}

          <button
            onClick={() =>
              setSelectedStatus(
                "PENDING"
              )
            }
            className={`
            bg-white
            rounded-2xl
            px-5
            py-4
            border
            shadow-sm
            flex
            items-center
            justify-between
            transition-all
            hover:shadow-md
            ${
              selectedStatus ===
              "PENDING"
                ? "ring-2 ring-yellow-400"
                : ""
            }
            `}
          >

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-10
              h-10
              rounded-xl
              bg-yellow-100
              flex
              items-center
              justify-center
              ">

                <Clock3
                  size={18}
                  className="
                  text-yellow-600
                  "
                />

              </div>

              <div className="text-left">

                <p className="
                text-xs
                text-slate-500
                uppercase
                tracking-wide
                ">
                  Pending
                </p>

                <h2 className="
                text-2xl
                font-bold
                text-slate-800
                ">
                  {pending}
                </h2>

              </div>

            </div>

          </button>

          {/* PREPARING */}

          <button
            onClick={() =>
              setSelectedStatus(
                "PREPARING"
              )
            }
            className={`
            bg-white
            rounded-2xl
            px-5
            py-4
            border
            shadow-sm
            flex
            items-center
            justify-between
            transition-all
            hover:shadow-md
            ${
              selectedStatus ===
              "PREPARING"
                ? "ring-2 ring-orange-400"
                : ""
            }
            `}
          >

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-10
              h-10
              rounded-xl
              bg-orange-100
              flex
              items-center
              justify-center
              ">

                <ChefHat
                  size={18}
                  className="
                  text-orange-600
                  "
                />

              </div>

              <div className="text-left">

                <p className="
                text-xs
                text-slate-500
                uppercase
                tracking-wide
                ">
                  Preparing
                </p>

                <h2 className="
                text-2xl
                font-bold
                text-slate-800
                ">
                  {preparing}
                </h2>

              </div>

            </div>

          </button>

          {/* READY */}

          <button
            onClick={() =>
              setSelectedStatus(
                "READY_FOR_PICKUP"
              )
            }
            className={`
            bg-white
            rounded-2xl
            px-5
            py-4
            border
            shadow-sm
            flex
            items-center
            justify-between
            transition-all
            hover:shadow-md
            ${
              selectedStatus ===
              "READY_FOR_PICKUP"
                ? "ring-2 ring-green-400"
                : ""
            }
            `}
          >

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-10
              h-10
              rounded-xl
              bg-green-100
              flex
              items-center
              justify-center
              ">

                <PackageCheck
                  size={18}
                  className="
                  text-green-600
                  "
                />

              </div>

              <div className="text-left">

                <p className="
                text-xs
                text-slate-500
                uppercase
                tracking-wide
                ">
                  Ready
                </p>

                <h2 className="
                text-2xl
                font-bold
                text-slate-800
                ">
                  {ready}
                </h2>

              </div>

            </div>

          </button>

          {/* COMPLETED */}

          <button
            onClick={() =>
              setSelectedStatus(
                "COMPLETED"
              )
            }
            className={`
            bg-white
            rounded-2xl
            px-5
            py-4
            border
            shadow-sm
            flex
            items-center
            justify-between
            transition-all
            hover:shadow-md
            ${
              selectedStatus ===
              "COMPLETED"
                ? "ring-2 ring-slate-400"
                : ""
            }
            `}
          >

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-10
              h-10
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              ">

                <CheckCircle2
                  size={18}
                  className="
                  text-slate-600
                  "
                />

              </div>

              <div className="text-left">

                <p className="
                text-xs
                text-slate-500
                uppercase
                tracking-wide
                ">
                  Completed
                </p>

                <h2 className="
                text-2xl
                font-bold
                text-slate-800
                ">
                  {completed}
                </h2>

              </div>

            </div>

          </button>

        </div>

      </div>

      {/* ========================================= */}
      {/* EMPTY */}
      {/* ========================================= */}

      {filteredOrders.length === 0 && (

        <div className="
        bg-white
        border
        rounded-3xl
        p-12
        text-center
        text-slate-500
        shadow-sm
        mt-6
        ">

          🍔 No orders found

        </div>

      )}

      {/* ========================================= */}
      {/* ORDER GRID */}
      {/* ========================================= */}

      <div
        className={`
        grid
        gap-4
        mt-6
        ${
          gridCols === 5
            ? `
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            2xl:grid-cols-5
            `
            : `
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            `
        }
        `}
      >

        {filteredOrders.map(
          (order) => (

            <div
              key={order.orderId}
              className="
              bg-white
              rounded-2xl
              border
              shadow-sm
              overflow-hidden
              hover:shadow-lg
              transition-all
              "
            >

              {/* TOP */}

              <div className="
              border-b
              px-4
              py-4
              flex
              justify-between
              items-start
              ">

                <div>

                  <h2 className="
                  text-lg
                  font-bold
                  text-slate-800
                  ">
                    {order.studentName}
                  </h2>

                  <p className="
                  text-xs
                  text-slate-400
                  mt-1
                  break-all
                  ">
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
                  ${getStatusColor(
                    order.status
                  )}
                  `}
                >

                  <div className="
                  w-2
                  h-2
                  rounded-full
                  bg-current
                  animate-pulse
                  "></div>

                  {order.status.replaceAll(
                    "_",
                    " "
                  )}

                </div>

              </div>

              {/* BODY */}

              <div className="
              p-4
              space-y-2
              ">

                <div className="
                grid
                grid-cols-2
                gap-4
                ">

                  <div>

                    <p className="
                    text-xs
                    text-slate-400
                    ">
                      Pickup Code
                    </p>

                    <p className="
                    font-bold
                    text-2xl
                    ">
                      {order.pickupCode}
                    </p>

                  </div>

                  <div>

                    <p className="
                    text-xs
                    text-slate-400
                    ">
                      Total
                    </p>

                    <p className="
                    font-bold
                    text-2xl
                    ">
                      ₹
                      {order.totalAmount}
                    </p>

                  </div>

                </div>

                {/* CAFETERIA */}

                <div>

                  <p className="
                  text-xs
                  text-slate-400
                  mb-1
                  ">
                    Cafeteria
                  </p>

                  <p className="
                  font-medium
                  text-sm
                  ">
                    {order.cafeteriaName}
                  </p>

                </div>

                {/* ITEMS */}

                <div>

                  <p className="
                  text-xs
                  text-slate-400
                  mb-2
                  ">
                    Items
                  </p>

                  <div className="
                  space-y-2
                  ">

                    {order.items?.map(
                      (
                        item: any,
                        index: number
                      ) => (

                        <div
                          key={index}
                          className="
                          bg-slate-50
                          rounded-lg
                          px-2
                          py-1.5
                          flex
                          gap-2
                          items-center
                          "
                        >

                          <img
                            src={
                              item.imageUrl ||
                              "https://placehold.co/100"
                            }
                            alt={
                              item.itemName
                            }
                            className="
                            w-11
                            h-11
                            rounded-lg
                            object-cover
                            "
                          />

                          <div>

                            <p className="
                            font-semibold
                            text-sm
                            leading-tight
                            ">
                              {item.itemName}
                            </p>

                            <p className="
                            text-xs
                            text-slate-500
                            ">
                              Qty:
                              {" "}
                              {
                                item.quantity
                              }
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* BUTTONS */}

                {order.status ===
                  "PENDING" && (

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
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                    mt-3
                    "
                  >

                    Start Preparing

                  </button>

                )}

                {order.status ===
                  "PREPARING" && (

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
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                    mt-3
                    "
                  >

                    Mark Ready

                  </button>

                )}

                {order.status ===
                  "READY_FOR_PICKUP" && (

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
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                    mt-3
                    "
                  >

                    Complete Order

                  </button>

                )}

                {order.status ===
                  "COMPLETED" && (

                  <div className="
                  bg-slate-100
                  text-slate-500
                  text-center
                  py-2.5
                  rounded-xl
                  font-medium
                  mt-3
                  ">

                    Order Completed

                  </div>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}