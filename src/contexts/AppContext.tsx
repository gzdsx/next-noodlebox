'use client';

import React, {useContext} from 'react';
import {Category} from "@/types";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";


interface AppContextType {
    categories: Category[];
    session: Session | null;
}

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({children, categories = [], session = null}: {
    children: React.ReactNode,
    categories: Category[],
    session: Session | null
}) => {

    return (
        <AppContext.Provider value={{
            categories,
            session
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
    const context = useAppContext();
    return context.categories;
}

export function useCurrentUser() {
    const {data: session} = useSession();
    return session?.user;
}