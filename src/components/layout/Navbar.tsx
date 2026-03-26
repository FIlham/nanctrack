/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Menu, Bell, Search, User } from "lucide-react";
import { useUIStore } from "@/src/store/uiStore";
import { Button } from "@/src/components/ui/Button";

export function Navbar({ user }: { user: any }) {
  const { openSidebar } = useUIStore();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-base-600 bg-base-900/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={openSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="h-9 w-full rounded-full border border-base-600 bg-base-800 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary" />
        </Button>
        <div className="ml-2 flex items-center gap-3 pl-2 border-l border-base-600">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium capitalize">{displayName}</p>
            <p className="text-xs text-text-muted">Premium User</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base-700 border border-base-600">
            <User className="h-5 w-5 text-text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
}
