'use client'

import {createContext, useContext, useEffect, useState} from "react";
import {useCurrentUser} from "@/contexts/AppContext";
import {getLotteryOptions} from "@/actions/lottery";
import LotteryOverlayer from "@/components/frontend/LotteryOverlayer";

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
    const currentUser = useCurrentUser();
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        (async function () {
            const settings = await getLotteryOptions();
            setSettings(settings);
        })()
    }, []);

    return (
        <LotteryContext.Provider value={{
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            isOpen,
        }}>
            {children}

            {
                settings.enable === 'yes' && (
                    <div className={'hidden md:block fixed top-[48%] left-0 z-50 cursor-pointer'}>
                        <img src={settings.float_icon} alt="" className={'w-[64px] h-[64px]'}
                             onClick={() => setIsOpen(true)}/>
                        <span
                            className={'absolute rounded-full leading-3 p-2 -top-4 right-0 bg-red-500 text-[12px] text-white text-center'}>{currentUser?.points || 0}</span>
                    </div>
                )
            }
            {
                isOpen && <LotteryOverlayer settings={settings} onClose={() => setIsOpen(false)}/>
            }
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