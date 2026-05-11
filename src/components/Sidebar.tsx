import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag,
  LucideIcon
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ✅ FIXED NAV ITEMS */
const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Menu Management",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Standard Menu",
    href: "/admin/standard-menu",
    icon: UtensilsCrossed,
  },
];

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300",
          open ? "w-64" : "w-16",
          "lg:translate-x-0",
          !open && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">

          <div className="space-y-2">
            {adminNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      !open && "justify-center px-2",
                      isActive && "bg-primary text-primary-foreground shadow-sm"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />

                    {open && (
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

        </div>
      </aside>
    </>
  );
};