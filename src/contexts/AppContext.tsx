'use client';

import React, {useContext} from 'react';
import {Category} from "@/types";
import {useSession} from "next-auth/react";

interface AppContextType {
    categories: Category[];
    webconfig: Record<string, any>;
}

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({children, categories = [], webconfig = {}}: {
    children: React.ReactNode,
    categories: Category[],
    webconfig?: Record<string, any>
}) => {
    return (
        <AppContext.Provider value={{
            categories,
            webconfig
        }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
}

export function useCategories() {
    const {categories} = useAppContext();
    return categories;
}

export function useCurrentUser() {
    const {data: session} = useSession();
    return session?.user || {};
}

export function useWebConfig() {
    const {webconfig} = useAppContext();
    return webconfig;
}