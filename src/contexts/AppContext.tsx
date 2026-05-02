'use client';

import React, {useContext, useEffect, useState} from 'react';
import {apiGet} from "@/lib/api";

interface Category {
    id: number;
    name: string;
    slug: string;
    children: Category[];
}

interface AppContextType {
    categories: Category[];
}

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({children}: { children: React.ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiGet('/categories', {taxonomy: 'product'});
                setCategories(response.data.items);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCategories();
    }, []);

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