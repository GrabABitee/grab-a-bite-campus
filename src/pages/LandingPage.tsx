import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  ArrowRight,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-6 py-10">

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SECTION */}

        <div className="space-y-8">

          <div className="flex items-center gap-4">

            <img
              src="/logo.png"
              alt="Grab A Bite"
              className="w-20 h-20 rounded-3xl shadow-xl object-cover"
            />

            <div>
              <h1 className="text-5xl font-black text-orange-500">
                Grab A Bite
              </h1>

              <p className="text-gray-500 text-lg mt-1">
                Smart Cafeteria Pre-ordering System
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <h2 className="text-6xl font-black leading-tight text-gray-900">

              Skip the Queue.
              <br />

              <span className="text-orange-500">
                Grab & Go.
              </span>

            </h2>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">

              Order cafeteria meals before reaching campus,
              save waiting time, and enjoy a smooth dining experience.

            </p>

          </div>

          {/* FEATURES */}

          <div className="grid sm:grid-cols-3 gap-4">

            <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-100">

              <Clock3 className="text-orange-500 mb-3" />

              <h3 className="font-bold text-gray-900">
                Faster Ordering
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Reduce cafeteria waiting time with online pre-orders.
              </p>

            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-100">

              <Sparkles className="text-orange-500 mb-3" />

              <h3 className="font-bold text-gray-900">
                Smart Suggestions
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Personalized food recommendations for students.
              </p>

            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-100">

              <ShieldCheck className="text-orange-500 mb-3" />

              <h3 className="font-bold text-gray-900">
                Secure Platform
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                JWT authentication and secure payment integration.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="flex justify-center">

          <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">

            <CardContent className="p-10">

              <div className="flex flex-col items-center text-center space-y-8">

                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-28 h-28 object-cover rounded-3xl shadow-xl"
                />

                <div>

                  <h1 className="text-4xl font-black text-gray-900">
                    Welcome
                  </h1>

                  <p className="text-gray-500 mt-3 leading-relaxed">

                    Access your cafeteria dashboard,
                    manage orders, and enjoy a seamless food ordering experience.

                  </p>

                </div>

                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold shadow-xl"
                >

                  Continue to Login

                  <ArrowRight className="ml-2 h-5 w-5" />

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}