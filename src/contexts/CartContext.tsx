'use client';

import React, {createContext, useContext, useState, useEffect, useCallback, ReactNode} from 'react';
import {CartItem, Product} from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ProductInfoClient} from "@/components/frontend/ProductInfoClient";
import {apiDelete, apiGet, apiPost, apiPut} from "@/lib/api";


interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    reloadCart: () => void;
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

    const fetchItems = async () => {
        try {
            const response = await apiGet('/carts');
            setItems([...response.data.items]);
        } catch {

        }
    }

    // Load from localStorage on mount
    useEffect(() => {
        (async () => {
            await fetchItems();
        })()
    }, []);

    // Sync to localStorage on change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback(async (newItem: CartItem) => {
        await apiPost(`/carts`, {
            product_id: newItem.product_id,
            product_type: newItem.product_type,
            price: newItem.price,
            quantity: newItem.quantity,
            purchase_via: newItem.purchase_via,
            options: newItem.options,
            additional_options: newItem.additional_options,
        });
        await fetchItems();
    }, []);

    const removeItem = useCallback(async (id: number) => {
        await apiDelete(`/carts/${id}`);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback(async (id: number, quantity: number) => {
        await apiPut(`/carts/${id}`, {quantity});
        setItems(prevItems => prevItems.map(item => item.id === id ? {...item, quantity} : item));
    }, []);

    const clearCart = useCallback(async () => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            reloadCart: fetchItems,
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