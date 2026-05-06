'use client'

import {useEffect, useState} from "react";
import {apiGet} from "@/lib/api";
import LotteryOverlayer from "@/components/frontend/LotteryOverlayer";
import {useCurrentUser} from "@/contexts/AppContext";

const LotteryClient = () => {
    const currentUser = useCurrentUser();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/lottery/settings');
            setSettings({...response.data});
        } catch (e: unknown) {
            console.error((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSettings();
    }, []);

    if (loading) return null;

    return (
        <>
            {
                settings.enable === 'yes' && (
                    <div className={'fixed top-[48%] left-0 z-50 cursor-pointer'}>
                        <img src={settings.float_icon} alt="" className={'w-[64px] h-[64px]'}
                             onClick={() => setIsOpen(true)}/>
                        <span
                            className={'absolute rounded-full leading-3 p-2 -top-4 right-0 bg-red-500 text-white text-center'}>{currentUser?.points}</span>
                    </div>
                )
            }
            {
                isOpen && <LotteryOverlayer settings={settings} onClose={() => setIsOpen(false)}/>
            }
        </>
    );
};

export default LotteryClient;