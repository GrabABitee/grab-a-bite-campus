import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
} from "lucide-react";

export default function Analytics() {

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-white
      to-orange-50
      p-8
      "
    >

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1
            className="
            text-5xl
            font-black
            text-slate-800
            tracking-tight
            "
          >
            Analytics
          </h1>

          <p
            className="
            text-slate-500
            mt-3
            text-lg
            "
          >
            Real-time cafeteria performance overview
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-7 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Total Orders
                </p>

                <h2 className="text-4xl font-black mt-2">
                  1,284
                </h2>

              </div>

              <ShoppingBag className="text-orange-500 w-8 h-8" />

            </div>

          </div>

          <div className="bg-white rounded-3xl p-7 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Revenue
                </p>

                <h2 className="text-4xl font-black mt-2">
                  ₹84K
                </h2>

              </div>

              <IndianRupee className="text-green-500 w-8 h-8" />

            </div>

          </div>

          <div className="bg-white rounded-3xl p-7 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Active Users
                </p>

                <h2 className="text-4xl font-black mt-2">
                  324
                </h2>

              </div>

              <Users className="text-blue-500 w-8 h-8" />

            </div>

          </div>

          <div className="bg-white rounded-3xl p-7 border shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Growth
                </p>

                <h2 className="text-4xl font-black mt-2">
                  +18%
                </h2>

              </div>

              <TrendingUp className="text-purple-500 w-8 h-8" />

            </div>

          </div>

        </div>

        {/* BIG CARD */}

        <div
          className="
          mt-8
          bg-white
          rounded-[32px]
          border
          shadow-sm
          p-10
          "
        >

          <h2
            className="
            text-3xl
            font-bold
            text-slate-800
            "
          >
            Cafeteria Insights
          </h2>

          <p
            className="
            text-slate-500
            mt-3
            "
          >
            Analytics charts and reports can be added here.
          </p>

          <div
            className="
            mt-10
            h-[400px]
            rounded-3xl
            bg-gradient-to-br
            from-slate-100
            to-slate-50
            border
            border-dashed
            border-slate-300
            flex
            items-center
            justify-center
            text-slate-400
            text-lg
            "
          >
            Analytics Charts Area
          </div>

        </div>

      </div>

    </div>
  );
}