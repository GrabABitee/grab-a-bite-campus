import {
  BarChart3,
  ShoppingBag,
  Users,
  IndianRupee,
  Clock3,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function Analytics() {

  const [orders, setOrders] = useState<any[]>([]);
  const [timeline, setTimeline] = useState("weekly");

  /* ================= LOAD ORDERS ================= */

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const data = await api.getOrders();

        setOrders(data || []);

      } catch (err) {
        console.error(err);
      }
    };

    loadAnalytics();

  }, []);

  /* ================= FILTER ORDERS ================= */

  const filteredOrders = useMemo(() => {

    const now = new Date();

    return orders.filter((order) => {

      const createdAt = new Date(order.createdAt);

      const diff =
        (now.getTime() - createdAt.getTime()) /
        (1000 * 60 * 60 * 24);

      if (timeline === "daily") {
        return diff <= 1;
      }

      if (timeline === "weekly") {
        return diff <= 7;
      }

      if (timeline === "monthly") {
        return diff <= 30;
      }

      return true;
    });

  }, [orders, timeline]);

  /* ================= KPIs ================= */

  const revenue = filteredOrders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  const activeStudents = new Set(
    filteredOrders.map((o) => o.studentName)
  ).size;

  const avgOrder =
    totalOrders > 0
      ? Math.round(revenue / totalOrders)
      : 0;

  /* ================= STATUS COUNTS ================= */

  const pendingCount = filteredOrders.filter(
    (o) => o.status === "PENDING"
  ).length;

  const completedCount = filteredOrders.filter(
    (o) => o.status === "COMPLETED"
  ).length;

  const preparingCount = filteredOrders.filter(
    (o) => o.status === "PREPARING"
  ).length;

  /* ================= SALES CHART ================= */

  const salesMap: any = {};

  filteredOrders.forEach((order) => {

    const date = new Date(order.createdAt);

    let key = "";

    if (timeline === "daily") {

      key = `${date.getHours()}:00`;

    } else {

      key = date.toLocaleDateString("en-US", {
        weekday: "short",
      });
    }

    salesMap[key] =
      (salesMap[key] || 0) +
      Number(order.totalAmount || 0);
  });

  const salesData = Object.keys(salesMap).map(
    (key) => ({
      name: key,
      revenue: salesMap[key],
    })
  );

  /* ================= TOP SELLING ITEMS ================= */

  const itemMap: any = {};

  filteredOrders.forEach((order) => {

    order.items?.forEach((item: any) => {

      itemMap[item.itemName] =
        (itemMap[item.itemName] || 0) +
        item.quantity;
    });
  });

  const topItems = Object.keys(itemMap)
    .map((name) => ({
      name,
      quantity: itemMap[name],
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  /* ================= PIE DATA ================= */

  const pieData = [
    {
      name: "Pending",
      value: pendingCount,
      color: "#f59e0b",
    },
    {
      name: "Preparing",
      value: preparingCount,
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: completedCount,
      color: "#10b981",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Analytics Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Real cafeteria insights and performance metrics
          </p>

        </div>

        {/* FILTER */}
        <select
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="
            h-11
            px-4
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            outline-none
          "
        >
          <option value="daily">
            Daily
          </option>

          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>

        </select>

      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Revenue
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹{revenue}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <IndianRupee className="text-green-600" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Orders
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalOrders}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="text-orange-500" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Active Students
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {activeStudents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Users className="text-violet-600" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Avg Order
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹{avgOrder}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Clock3 className="text-blue-600" />
            </div>

          </div>

        </div>

      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* SALES */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex items-center gap-3 mb-6">

            <BarChart3 className="text-slate-700" />

            <h2 className="text-xl font-semibold">
              Revenue Overview
            </h2>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={salesData}>

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  radius={[10, 10, 0, 0]}
                  fill="#3b82f6"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* STATUS PIE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <h2 className="text-xl font-semibold mb-6">
            Order Status
          </h2>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={110}
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={entry.color}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* TREND */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <h2 className="text-xl font-semibold mb-6">
            Revenue Trend
          </h2>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={salesData}>

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* TOP ITEMS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <h2 className="text-xl font-semibold mb-6">
            Top Selling Items
          </h2>

          <div className="space-y-4">

            {topItems.map((item, index) => (

              <div
                key={item.name}
                className="
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-2xl
                  bg-slate-50
                "
              >

                <div>

                  <p className="font-semibold text-slate-900">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.quantity} sold
                  </p>

                </div>

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-900
                  text-white
                  flex
                  items-center
                  justify-center
                  font-semibold
                ">
                  #{index + 1}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}