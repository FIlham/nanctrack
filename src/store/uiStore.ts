/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  isDarkMode: true, // Default to dark mode
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
