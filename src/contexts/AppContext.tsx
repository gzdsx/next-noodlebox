'use client';

import React, {useContext} from 'react';
import {Category} from "@/types";

interface AppContextType {
    categories: Category[];
}

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({children, categories = []}: { children: React.ReactNode, categories: Category[] }) => {

    return (
        <AppContext.Provider value={{categories}}>
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
    const context = useAppContext();
    return context.categories;
}