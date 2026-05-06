'use client'

import {useState} from "react";

const LotteryChestBox = ({onOpened}: { onOpened?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shaking, setShaking] = useState(false);

    const startShaking = () => {
        if (isOpen || shaking) return;
        setShaking(true);
        setTimeout(() => {
            setIsOpen(true);
            setShaking(false);
            onOpened?.();
        }, 1500);
    }

    const handleTryAgain = () => {
        setIsOpen(false);
        startShaking();
    }

    return (
        <div className={`lottery-chest-box-bg`}>
            <div className={'w-full h-full absolute top-0 left-0 z-5 flex flex-col items-center justify-center'}>
                <div
                    onClick={startShaking}
                    className={`lottery-chest-box ${isOpen ? 'bg-[url(/lottery/chest/chest-open.png)]' : 'bg-[url(/lottery/chest/chest-close.png)]'} ${shaking ? 'lottery-chest-box-shaking' : ''}`}></div>
                {
                    isOpen && (
                        <button className={'bg-[#f19e39] text-white px-4 py-2 rounded-md mt-8'}
                                onClick={handleTryAgain}>Try Again</button>
                    )
                }
            </div>
        </div>
    );
};

export default LotteryChestBox;