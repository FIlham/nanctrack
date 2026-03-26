/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useUIStore } from "@/src/store/uiStore";
import { Button } from "@/src/components/ui/Button";

import { supabase } from "@/src/lib/supabase";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: ArrowLeftRight, label: "Transactions", path: "/transactions" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Receipt, label: "Bills", path: "/bills" },
  { icon: PieChart, label: "Budget", path: "/budget" },
  { icon: Sparkles, label: "Monthly Recap", path: "/recap" },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeSidebar();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 transform border-r border-base-600 bg-base-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow-p">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Finance<span className="text-primary">Tracker</span>
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={closeSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => closeSidebar()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-base-700",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-glow-p/10" 
                      : "text-text-secondary hover:text-white"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-1 pt-4 border-t border-base-600">
            <NavLink
              to="/settings"
              onClick={() => closeSidebar()}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-base-700",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-text-secondary hover:text-white"
                )
              }
            >
              <Settings className="h-5 w-5" />
              Settings
            </NavLink>
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-tertiary transition-all hover:bg-tertiary/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
