import { Link } from "react-router-dom";
import {
  ClipboardList,
  UtensilsCrossed,
  BookOpen,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminEntryPage() {

  const [cafeteriaName, setCafeteriaName] =
    useState("Campus Cafeteria");

  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pending: 0,
    completed: 0,
  });

  /* ================= LOAD REAL USER + CAFE ================= */

  useEffect(() => {

    const loadData = async () => {

      try {

        const user = await api.getCurrentUser();

        /* REAL CAFETERIA NAME */
        if (user?.cafeteria?.name) {
          setCafeteriaName(user.cafeteria.name);
        }

        /* LOAD ORDERS */
        const orders = await api.getOrders();

        const totalOrders = orders.length;

        const revenue = orders.reduce(
          (sum: number, order: any) =>
            sum + Number(order.totalAmount || 0),
          0
        );

        const pending = orders.filter(
          (o: any) => o.status === "PENDING"
        ).length;

        const completed = orders.filter(
          (o: any) => o.status === "COMPLETED"
        ).length;

        setStats({
          totalOrders,
          revenue,
          pending,
          completed,
        });

      } catch (error) {
        console.error(error);
      }
    };

    loadData();

  }, []);

  const cards = [
    {
      title: "Live Orders",
      description:
        "Track pending, preparing and completed orders in real time.",
      icon: ClipboardList,
      href: "/admin/orders",
      button: "Open Dashboard",
      gradient:
        "from-slate-900 via-slate-800 to-blue-700",
      buttonColor:
        "bg-white text-slate-900 hover:bg-slate-100",
    },

    {
      title: "Menu Management",
      description:
        "Manage breakfast, lunch and snacks with live controls.",
      icon: UtensilsCrossed,
      href: "/admin/menu",
      button: "Open Menu",
      gradient:
        "from-orange-500 to-orange-400",
      buttonColor:
        "bg-white/20 hover:bg-white/30 text-white",
    },

    {
      title: "Standard Menu",
      description:
        "Configure reusable menu templates and cafeteria defaults.",
      icon: BookOpen,
      href: "/admin/standard-menu",
      button: "Open Standard Menu",
      gradient:
        "from-sky-500 to-blue-500",
      buttonColor:
        "bg-white/20 hover:bg-white/30 text-white",
    },

    {
      title: "Analytics",
      description:
        "Revenue, order trends and cafeteria performance insights.",
      icon: BarChart3,
      href: "/admin/analytics",
      button: "Open Analytics",
      gradient:
        "from-violet-500 to-indigo-500",
      buttonColor:
        "bg-white/20 hover:bg-white/30 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2">
            Grab A Bite Admin
          </p>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h1>

          {/* REAL CAFETERIA NAME */}
          <p className="text-slate-500 mt-2 text-lg">
            {cafeteriaName}
          </p>

        </div>

        {/* MAIN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {cards.map((card) => {

            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`
                  relative
                  overflow-hidden
                  rounded-3xl
                  p-7
                  min-h-[260px]
                  bg-gradient-to-br
                  ${card.gradient}
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                `}
              >

                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6">

                  <Icon className="h-7 w-7 text-white" />

                </div>

                <div className="relative z-10">

                  <h2 className="text-3xl font-bold text-white mb-3">
                    {card.title}
                  </h2>

                  <p className="text-white/80 leading-relaxed max-w-md text-[15px]">
                    {card.description}
                  </p>

                </div>

                <div className="absolute bottom-7 left-7">

                  <Link to={card.href}>

                    <button
                      className={`
                        ${card.buttonColor}
                        px-5
                        h-12
                        rounded-2xl
                        font-semibold
                        flex
                        items-center
                        gap-2
                        transition-all
                        duration-200
                      `}
                    >

                      {card.button}

                      <ArrowRight className="h-4 w-4" />

                    </button>

                  </Link>

                </div>

              </div>
            );
          })}
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Orders
            </p>

            <h3 className="text-3xl font-bold mt-2 text-slate-900">
              {stats.totalOrders}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">
              Revenue
            </p>

            <h3 className="text-3xl font-bold mt-2 text-slate-900">
              ₹{stats.revenue}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <h3 className="text-3xl font-bold mt-2 text-orange-500">
              {stats.pending}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <h3 className="text-3xl font-bold mt-2 text-green-500">
              {stats.completed}
            </h3>
          </div>

        </div>

      </div>
    </div>
  );
}