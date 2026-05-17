'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

const CheckoutNoticeDialog = ({message,onClose}: { message: string,onClose: () => void }) => {
    return (
        <Dialog defaultOpen={true} onOpenChange={onClose}>
            <DialogTrigger asChild>Open</DialogTrigger>
            <DialogContent className={'border-none z-1000'} onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className={'text-orange-500'}>Notice</DialogTitle>
                    <DialogDescription className={'text-orange-600 text-[16px]'}>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={onClose}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutNoticeDialog;