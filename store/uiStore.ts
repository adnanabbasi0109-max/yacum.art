import { create } from 'zustand';

type CursorVariant = 'default' | 'hover' | 'view';

interface UIState {
  cursorVariant: CursorVariant;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  setCursorVariant: (variant: CursorVariant) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUiStore = create<UIState>((set) => ({
  cursorVariant: 'default',
  isCartOpen: false,
  isMobileMenuOpen: false,

  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  setCartOpen: (open) => set({ isCartOpen: open }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));
