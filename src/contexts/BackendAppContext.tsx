'use client';

import React, {createContext, useContext, useState, useCallback, useEffect, useRef} from 'react';
import {App} from "antd";
import {Order as OrderType} from "@/types";
import MediaLibrary, {MediaType} from "@/components/backend/MediaLibrary";
import ModalOrderProcessor from "@/components/backend/ModalOrderProcessor";

interface MediaLibraryOptions {
    multiple?: boolean;
    onSelect?: (medias: MediaType[]) => void;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
}


interface BackendAppContextType {
    mediaLibrary: {
        open: (options?: MediaLibraryOptions) => void;
        close: () => void;
    },
    administrator: AdminUser | null;
    orderProcessor: {
        open: (order: OrderType, callback?: (order: OrderType) => void) => void;
        close: () => void;
    }
}

const BackendAppContext = createContext<BackendAppContextType | undefined>(undefined);

export function BackendAppProvider({children}: { children: React.ReactNode }) {
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [mediaLibraryOptions, setMediaLibraryOptions] = useState<MediaLibraryOptions | null | undefined>(null);
    const [administrator, setAdministrator] = useState<AdminUser | null>(null);
    const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null);
    const [orderProcessorVisible, setOrderProcessorVisible] = useState(false);

    const orderProcessorCallbackRef = useRef<((order: OrderType) => void) | undefined>(undefined);

    useEffect(() => {
        (function () {
            try {
                const data = localStorage.getItem('adminUser');
                if (data) {
                    setAdministrator(JSON.parse(data));
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, []);

    const openMediaLibrary = useCallback((options?: MediaLibraryOptions) => {
        setMediaLibraryOpen(true);
        setMediaLibraryOptions(options);
    }, []);

    const closeMediaLibrary = useCallback(() => {
        setMediaLibraryOpen(false);
    }, []);

    const openOrderProcessor = useCallback((order: OrderType, callback?: (order: OrderType) => void) => {
        setCurrentOrder(order);
        setOrderProcessorVisible(true);
        orderProcessorCallbackRef.current = callback;
    }, []);

    const closeOrderProcessor = () => {
        setCurrentOrder(null);
        setOrderProcessorVisible(false);
        orderProcessorCallbackRef.current?.(currentOrder as OrderType);
        orderProcessorCallbackRef.current = undefined;
    }

    return (
        <BackendAppContext.Provider value={{
            mediaLibrary: {
                open: openMediaLibrary,
                close: closeMediaLibrary,
            },
            administrator,
            orderProcessor: {
                open: openOrderProcessor,
                close: closeOrderProcessor,
            }
        }}>
            {children}
            {
                mediaLibraryOpen && (
                    <MediaLibrary
                        {...mediaLibraryOptions}
                        open={true}
                        onClose={closeMediaLibrary}
                    />
                )
            }
            {
                orderProcessorVisible && (
                    <ModalOrderProcessor
                        isOpen={true}
                        order={currentOrder}
                        onClose={closeOrderProcessor}
                    />
                )
            }
        </BackendAppContext.Provider>
    )
}

export function useBackendApp() {
    const context = useContext(BackendAppContext);
    if (!context) {
        throw new Error('useBackendApp must be used inside BackendAppProvider');
    }
    return context;
}


export function useMediaLibrary() {
    const {mediaLibrary} = useBackendApp();
    return mediaLibrary;
}

export function useAdministrator() {
    const {administrator} = useBackendApp();
    return administrator;
}

export function useMessage() {
    const {message} = App.useApp();
    return message;
}

export function useModal() {
    const {modal} = App.useApp();
    return modal;
}

export function useNotification() {
    const {notification} = App.useApp();
    return notification;
}

export function useOrderProcessor() {
    const {orderProcessor} = useBackendApp();
    return orderProcessor;
}