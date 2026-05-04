'use client'

import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";
import {apiPost} from "@/lib/api";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const DialogVerifyPhoneNumber = ({iddCode, phoneNumber, onSuccess, onClose}: {
    iddCode: string,
    phoneNumber: string,
    onSuccess: () => void,
    onClose: () => void
}) => {
    const [waiting, setWaiting] = useState(false);
    const [seconds, setSeconds] = useState(120);
    const [vercode, setVercode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout>(null);

    const handleGetCode = async () => {
        if (waiting) return false;
        try {
            await apiPost('/captcha/sms', {
                national_number: iddCode,
                phone_number: phoneNumber,
            });
            setWaiting(true);
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } catch(e: unknown) {
            setWaiting(false);
            if (intervalRef.current){
                clearInterval(intervalRef.current);
            }
        } finally {

        }
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await apiPost('/my/phones/verify', {
                national_number: iddCode,
                phone_number: phoneNumber,
                vercode
            });
            onSuccess?.();
        } catch (e: unknown) {
            console.log(e instanceof Error);
            if (e instanceof Error) {
                toast.error(e.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (seconds === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setWaiting(false);
            setSeconds(120);
        }
    }, [seconds]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, []);

    return (
        <Dialog open={true} modal={true} onOpenChange={() => onClose?.()}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className={'w-125 max-w-[96vw] border-[#444]'}>
                <DialogHeader>
                    <DialogTitle>Verify Your Phone Number</DialogTitle>
                </DialogHeader>
                <div>
                    <div className={'text-center text-gray-400'}>Please enter the verification code sent to your phone
                        number.
                    </div>
                    <div className={'text-[#f19e39] font-bold text-[18px] text-center'}>+{iddCode + '' + phoneNumber}</div>
                </div>
                <div className={'mt-8'}>
                    <InputGroup className={'h-11'}>
                        <InputGroupInput
                            name={'verify-phone-number'}
                            inputMode={'numeric'}
                            id={'verify-phone-number'}
                            autoComplete={'new-password'}
                            placeholder={'Enter verification code'}
                            value={vercode}
                            onChange={(e) => setVercode(e.target.value)}
                        />
                        <InputGroupAddon align={'inline-end'}>
                            <InputGroupButton
                                className={'cursor-pointer'}
                                onClick={handleGetCode}
                            >{waiting ? `${seconds}s remaining` : 'Get Code'}</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>

                    <div className={'mt-8'}>
                        <Button
                            onClick={handleSubmit}
                            disabled={vercode.length === 0 || submitting}
                            className={'h-11 w-full bg-[#66beb8] hover:bg-[#6eacb1] cursor-pointer'}>Continue</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogVerifyPhoneNumber;