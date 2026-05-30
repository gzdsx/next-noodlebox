'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {sendSmsCode} from "@/actions/sms";
import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";

export default function SmsLoginClient() {
    const searchParams = useSearchParams();
    const [iddcode, setIddcode] = useState('353');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        if (!phoneNumber) {
            setError('Please enter your phone number');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await sendSmsCode(iddcode, phoneNumber);
            setCountdown(120);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Send code failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!phoneNumber || !code) {
            return;
        }
        setLoading(true);
        setError('');
        const result = await signIn('sms', {
            iddcode,
            phone_number: phoneNumber,
            code: code,
            redirect: false,
            redirectTo: '/'
        });
        setLoading(false);
        if (result?.error) {
            setError('Your Verification Code is incorrect');
            return;
        }

        if (result?.ok) {
            const redirect = searchParams.get('redirect') || '/';
            if (redirect) window.location.href = redirect;
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <InputGroup className={'h-11'}>
                    <InputGroupInput
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                        }}
                        required
                    />
                    <InputGroupAddon>
                        <Select
                            value={iddcode}
                            onValueChange={(value) => setIddcode(value)}>
                            <SelectTrigger className="w-full max-w-48 border-0 text-white">
                                <SelectValue placeholder="Select a iddcode"/>
                            </SelectTrigger>
                            <SelectContent className={'border-0'}>
                                <SelectGroup>
                                    <SelectItem value="353">+353</SelectItem>
                                    <SelectItem value="44">+44</SelectItem>
                                    <SelectItem value="86">+86</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex gap-2">
                    <Input
                        id="code"
                        type="text"
                        placeholder="Your verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        className={'h-11'}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={countdown > 0 || loading}
                        className="whitespace-nowrap h-11"
                    >
                        {countdown > 0 ? `${countdown}s` : 'Get Code'}
                    </Button>
                </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full h-11 mt-4" disabled={loading}>
                {loading ? 'Logging...' : 'Login'}
            </Button>
        </form>
    );
}
