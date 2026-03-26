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
  PieChart 
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const mobileNavItems = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: ArrowLeftRight, label: "Trans", path: "/transactions" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Receipt, label: "Bills", path: "/bills" },
  { icon: PieChart, label: "Budget", path: "/budget" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-base-600 bg-base-800 px-4 pb-safe lg:hidden">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-primary" : "text-text-muted"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
