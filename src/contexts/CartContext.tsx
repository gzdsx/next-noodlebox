'use client';

import React, {createContext, useContext, useState, useEffect, useCallback, ReactNode} from 'react';
import {CartItem, Product} from "@/types";
import sha1 from "@/lib/sha1";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ProductInfoClient} from "@/components/frontend/ProductInfoClient";


interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (key: string) => void;
    updateQuantity: (key: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    productModal: {
        open: (product: Product) => void;
        close: () => void;
    }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';

export function CartProvider({children}: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const openProductModal = (product: Product) => {
        setCurrentProduct({...product});
        setIsProductModalOpen(true);
    }

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setCurrentProduct(null);
    }

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(stored));
            }
        } catch {
            // ignore
        }
    }, []);

    // Sync to localStorage on change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const generateKey = (item: CartItem) => {
        const {product_id, options, additional_options, purchase_via} = item;
        const key = JSON.stringify({
            product_id,
            options,
            additional_options,
            purchase_via
        });

        return sha1(key);
    }

    const addItem = useCallback((newItem: CartItem) => {
        setItems(prev => {
            const newKey = generateKey(newItem);
            const existing = prev.find(item => item.key === newKey);
            if (existing) {
                return prev.map(item =>
                    item.key === newKey
                        ? {...item, quantity: item.quantity + newItem.quantity}
                        : item
                );
            }
            return [...prev, {...newItem, key: newKey}];
        });
    }, []);

    const removeItem = useCallback((key: string) => {
        setItems(prev => prev.filter(item => {
            return !(item.key === key);
        }));
    }, []);

    const updateQuantity = useCallback((key: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(key);
            return;
        }
        setItems(prev => prev.map(item => {
            return (item.key === key)
                ? {...item, quantity}
                : item;
        }));
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            productModal: {
                open: openProductModal,
                close: closeProductModal
            }
        }}>
            {children}
            {
                (() => {
                    if (isProductModalOpen && currentProduct) {
                        return (
                            <Dialog open={true} modal={true} onOpenChange={closeProductModal}>
                                <DialogTrigger>Open</DialogTrigger>
                                <DialogContent className={'w-[96vw] min-w-[90vw] md:min-w-300 border-[#444]'}>
                                    <DialogHeader>
                                        <DialogTitle>Add Order</DialogTitle>
                                    </DialogHeader>
                                    <div className={'overflow-hidden'}>
                                        <ProductInfoClient
                                            product={currentProduct}
                                            scrollViewStyle={{
                                                maxHeight: '60vh',
                                                overflowY: 'auto',
                                                overflowX: 'hidden',
                                            }}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                    }
                    return null;
                })()
            }
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export function useProductModal() {
    const context = useCart();
    return context.productModal;
}