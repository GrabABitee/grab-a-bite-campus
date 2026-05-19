import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  BookOpenCheck,
  BarChart3,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: any;
};

interface SidebarProps {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/entry",
    icon: LayoutDashboard,
  },

  {
    title: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },

  {
    title: "Menu Management",
    href: "/admin/menu",
    icon: ChefHat,
  },

  {
    title: "Standard Menu",
    href: "/admin/standard-menu",
    icon: BookOpenCheck,
  },

  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export const Sidebar = ({
  open,
  onOpenChange,
}: SidebarProps) => {

  const location =
    useLocation();

  return (
    <>
      {open && (
        <div
          className="
          fixed
          inset-0
          bg-black/40
          z-40
          lg:hidden
          "
          onClick={() =>
            onOpenChange(false)
          }
        />
      )}

      <aside
        className={cn(
          `
          fixed
          left-0
          top-0
          z-50
          h-screen
          border-r
          border-slate-200
          bg-white/90
          backdrop-blur-xl
          transition-all
          duration-300
          flex
          flex-col
          `,
          open
            ? "w-64"
            : "w-20"
        )}
      >

        {/* LOGO */}

        <div
          className={cn(
            `
            flex
            items-center
            gap-3
            px-5
            py-6
            border-b
            border-slate-100
            `,
            !open &&
              "justify-center px-0"
          )}
        >

      <div className="flex items-center gap-3 px-6 py-5 border-b">
        
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Grab A Bite"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-none">
            Grab A Bite
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Admin Portal
          </p>
        </div>

      </div>



        </div>

        {/* NAV */}

        <div className="flex-1 p-4 space-y-2">

          {adminNavItems.map(
            (item) => {

              const isActive =
                location.pathname ===
                  item.href ||
                (
                  item.href !==
                    "/admin/entry" &&
                  location.pathname.startsWith(
                    item.href
                  )
                );

              const Icon =
                item.icon;

              return (

                <Link
                  key={item.href}
                  to={item.href}
                >

                  <Button
                    variant="ghost"
                    className={cn(

                      `
                      w-full
                      h-12
                      rounded-2xl
                      transition-all
                      duration-200
                      `,

                      open
                        ? "justify-start px-4"
                        : "justify-center px-0",

                      isActive
                        ? `
                          bg-gradient-to-r
                          from-orange-500
                          to-orange-400
                          text-white
                          hover:text-white
                          shadow-lg
                          `
                        : `
                          text-slate-600
                          hover:bg-orange-50
                          hover:text-orange-500
                          `
                    )}
                  >

                    <Icon
                      className={cn(
                        "w-5 h-5",
                        open &&
                          "mr-3"
                      )}
                    />

                    {open && (
                      <span className="font-medium">
                        {item.title}
                      </span>
                    )}

                  </Button>

                </Link>
              );
            }
          )}

        </div>

        {/* FOOTER */}

        {open && (

          <div
            className="
            p-4
            border-t
            border-slate-100
            "
          >

            <div
              className="
              rounded-2xl
              bg-orange-50
              p-4
              "
            >

              <p
                className="
                text-xs
                text-slate-500
                leading-relaxed
                "
              >
                Smart cafeteria operations platform for modern campuses.
              </p>

            </div>

          </div>

        )}

      </aside>
    </>
  );
};