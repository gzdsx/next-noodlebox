'use client'

import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import LotteryPrizeClient from "@/components/frontend/LotteryPrizeClient";
import LotteryChestBox from "@/components/frontend/LotteryChestBox";
import {toast} from "sonner";
import {useCart} from "@/contexts/CartContext";
import {X} from "lucide-react";
import {useSession} from "next-auth/react";
import {getLotteryResult} from "@/actions/lottery";

const LotteryOverlayer = ({settings, onClose}: { settings: Record<string, string>, onClose?: () => void }) => {
    const {reloadCart} = useCart();
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const [prize, setPrize] = useState<Record<string, string | number>>({});
    const [showPrize, setShowPrize] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [error, setError] = useState('');

    const getPrize = async () => {
        if (session.status === 'authenticated') {
            try {
                setLoading(true);
                const response = await getLotteryResult();
                setPrize({...response.data});
                setShowPrize(true);
                session.update({...session.data, updatedAt: new Date().toISOString()});
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        } else {
            window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.origin + window.location.pathname);
        }
    }

    return (
        <>
            <div
                className={'fixed top-0 left-0 w-full h-full z-60 bg-black flex flex-col items-center justify-center text-white'}>
                <h2 className={'text-center text-3xl'} dangerouslySetInnerHTML={{__html: settings.name}}></h2>
                <p className={'text-gray-200 text-center'} dangerouslySetInnerHTML={{__html: settings.description}}></p>
                {
                    error && (
                        <p className={'text-red-500 text-center mt-4'}>{error}</p>
                    )
                }
                <LotteryChestBox onOpened={getPrize}/>
                <div onClick={() => onClose?.()}
                     className={'absolute top-0 right-0 z-100 p-6 cursor-pointer hover:bg-gray-100/50'}>
                    <X size={24}/>
                </div>
            </div>
            {
                showPrize && (
                    <LotteryPrizeClient
                        prize={prize}
                        settings={settings}
                        onPick={() => {
                            setShowPrize(false);
                            if (prize.type === 'product') {
                                reloadCart();
                                toast.success(`The prize ${prize.name} has been added to your cart!`);
                            }

                            if (prize.type === 'point') {
                                setShowPoints(true);
                                setTimeout(() => {
                                    setShowPoints(false);
                                }, 2000);
                            }
                        }}
                    />
                )
            }
            {
                showPoints && (
                    <div className={'lotter-points-animate'}>+{prize.points}</div>
                )
            }
            {
                loading && (
                    <div className={'fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center bg-black/40'}>
                        <Spinner size={'lg'}/>
                    </div>
                )
            }
        </>
    );
};

export default LotteryOverlayer;