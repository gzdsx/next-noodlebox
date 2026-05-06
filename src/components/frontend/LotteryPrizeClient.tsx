'use client'

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

const LotteryPrizeClient = ({settings, prize, onPick}: {
    settings: Record<string, string>;
    prize: Record<string, any>;
    onPick?: () => void;
}) => {
    return (
        <Dialog open={true} onOpenChange={() => onPick?.()}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className={'w-[90vw] md:max-w-90 z-200'}>
                <DialogTitle></DialogTitle>
                <div className="flex flex-col items-center justify-center gap-y-4">
                    <h3 className={'text-[#f19e39] text-2xl'}>{settings.winning_text}</h3>
                    <div className={'aspect-square w-full'}>
                        <img src={prize.image as string} className={'w-full h-full object-cover'}
                             alt={prize.name as string}/>
                    </div>
                    <h3 className={'text-center'}>{prize.name}</h3>
                    <Button
                        onClick={() => onPick?.()}
                        className={'bg-[#66beb8] hover:bg-[#33beb0] text-white px-4 h-11 w-full'}
                        dangerouslySetInnerHTML={{__html: settings.pick_text}}></Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LotteryPrizeClient;