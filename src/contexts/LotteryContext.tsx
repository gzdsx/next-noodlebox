'use client'

import {createContext, useContext, useState} from "react";
import LotteryClient from "@/components/frontend/LotteryClient";

const LotteryContext = createContext<{
    open: () => void;
    close: () => void;
    isOpen: boolean;
}>({
    open: () => {
    },
    close: () => {
    },
    isOpen: false,
});

export const LotteryProvider = ({children}: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <LotteryContext.Provider value={{
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            isOpen,
        }}>
            {children}
            <LotteryClient isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </LotteryContext.Provider>
    );
}

export function useLottery() {
    const context = useContext(LotteryContext);
    if (!context) {
        throw new Error('useLottery must be used within a LotteryProvider');
    }
    return context;
}