import { create } from 'zustand';

export interface CartItem {
  artworkId: string;
  slug: string;
  title: string;
  arabic: string;
  previewImageUrl: string;
  type: 'digital' | 'print';
  printSize?: string;
  frameOption?: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (artworkId: string, type: string, printSize?: string) => void;
  updateQuantity: (artworkId: string, type: string, quantity: number, printSize?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.artworkId === item.artworkId &&
          i.type === item.type &&
          i.printSize === item.printSize &&
          i.frameOption === item.frameOption
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.artworkId === item.artworkId &&
            i.type === item.type &&
            i.printSize === item.printSize &&
            i.frameOption === item.frameOption
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (artworkId, type, printSize) => {
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(i.artworkId === artworkId && i.type === type && i.printSize === printSize)
      ),
    }));
  },

  updateQuantity: (artworkId, type, quantity, printSize) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.artworkId === artworkId && i.type === type && i.printSize === printSize
          ? { ...i, quantity }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
