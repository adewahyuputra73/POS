"use client";

import { create } from 'zustand';
import { CartItem, CartItemVariant } from '@/features/customer-order/types';
import { Product } from '@/features/products/types';

interface CustomerCartState {
    items: CartItem[];
    addItem: (product: Product, quantity: number, selectedVariants: CartItemVariant[], notes?: string) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getTax: (rate: number) => number;
    getServiceFee: (rate: number) => number;
    getTotal: (taxRate: number, serviceFeeRate: number) => number;
}

function generateCartItemId(): string {
    return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function calculateUnitPrice(basePrice: number, variants: CartItemVariant[]): number {
    const variantTotal = variants.reduce((sum, v) => sum + v.price, 0);
    return basePrice + variantTotal;
}

export const useCustomerCartStore = create<CustomerCartState>((set, get) => ({
    items: [],

    addItem: (product, quantity, selectedVariants, notes) => {
        const unitPrice = calculateUnitPrice(product.price, selectedVariants);
        const newItem: CartItem = {
            id: generateCartItemId(),
            product,
            quantity,
            selectedVariants,
            notes,
            unitPrice,
            subtotal: unitPrice * quantity,
        };

        set((state) => ({
            items: [...state.items, newItem],
        }));
    },

    removeItem: (cartItemId) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== cartItemId),
        }));
    },

    updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(cartItemId);
            return;
        }
        set((state) => ({
            items: state.items.map((item) =>
                item.id === cartItemId
                    ? { ...item, quantity, subtotal: item.unitPrice * quantity }
                    : item
            ),
        }));
    },

    clearCart: () => set({ items: [] }),

    getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    getTax: (rate) => {
        return Math.round(get().getSubtotal() * (rate / 100));
    },

    getServiceFee: (rate) => {
        return Math.round(get().getSubtotal() * (rate / 100));
    },

    getTotal: (taxRate, serviceFeeRate) => {
        const subtotal = get().getSubtotal();
        const tax = Math.round(subtotal * (taxRate / 100));
        const serviceFee = Math.round(subtotal * (serviceFeeRate / 100));
        return subtotal + tax + serviceFee;
    },
}));
