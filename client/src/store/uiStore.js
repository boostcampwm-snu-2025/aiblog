import { create } from 'zustand';

/**
 * Zustand Store for UI State Management
 * 
 * Purpose: Manage client-side UI state that doesn't need to be persisted
 * - Active tab (commits vs pull requests)
 * - Items per page selection
 * - Sort options
 * - Search/filter state
 * 
 * Why Zustand?
 * - Lightweight and simple API
 * - No need for providers/context
 * - Perfect for UI state that multiple components need access to
 */
export const useUIStore = create((set) => ({
  // Active tab: 'commits' or 'pulls'
  activeTab: 'commits',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Items per page
  itemsPerPage: 30,
  setItemsPerPage: (count) => set({ itemsPerPage: count }),

  // Sort configuration
  sortBy: 'date', // 'date', 'author', 'message'
  sortOrder: 'desc', // 'asc', 'desc'
  setSortBy: (field) => set({ sortBy: field }),
  setSortOrder: (order) => set({ sortOrder: order }),

  // Search query
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filter state for PRs
  prState: 'all', // 'all', 'open', 'closed'
  setPRState: (state) => set({ prState: state }),
}));
