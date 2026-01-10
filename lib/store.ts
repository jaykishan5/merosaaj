import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    image: string;
    quantity: number;
    size: string;
    color: string;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, size: string, color: string) => void;
    updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const existingItem = get().items.find(
                    (item) => item._id === newItem._id && item.size === newItem.size && item.color === newItem.color
                );

                if (existingItem) {
                    set({
                        items: get().items.map((item) =>
                            item._id === newItem._id && item.size === newItem.size && item.color === newItem.color
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...get().items, newItem] });
                }
            },
            removeItem: (id, size, color) => {
                set({
                    items: get().items.filter(
                        (item) => !(item._id === id && item.size === size && item.color === color)
                    ),
                });
            },
            updateQuantity: (id, size, color, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item._id === id && item.size === size && item.color === color
                            ? { ...item, quantity }
                            : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () =>
                get().items.reduce(
                    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
                    0
                ),
        }),
        {
            name: 'merosaaj-cart',
        }
    )
);

export interface WishlistItem {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    image: string;
}

interface WishlistStore {
    items: WishlistItem[];
    toggleItem: (item: WishlistItem) => void;
    isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (item) => {
                const exists = get().items.some((i) => i._id === item._id);
                if (exists) {
                    set({ items: get().items.filter((i) => i._id !== item._id) });
                } else {
                    set({ items: [...get().items, item] });
                }
            },
            isInWishlist: (id) => get().items.some((item) => item._id === id),
        }),
        {
            name: 'merosaaj-wishlist',
        }
    )
);

export interface RecentlyViewedItem {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    image: string;
}

interface RecentlyViewedStore {
    items: RecentlyViewedItem[];
    addToHistory: (item: RecentlyViewedItem) => void;
    clearHistory: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToHistory: (newItem) => {
                const currentItems = get().items;
                const filtered = currentItems.filter((i) => i._id !== newItem._id);
                const updated = [newItem, ...filtered].slice(0, 10);
                set({ items: updated });
            },
            clearHistory: () => set({ items: [] }),
        }),
        {
            name: 'merosaaj-recently-viewed',
        }
    )
);
