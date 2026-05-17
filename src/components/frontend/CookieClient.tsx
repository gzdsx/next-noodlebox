'use client';

import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";

const CookieClient = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const value = localStorage.getItem('accepted-cookies');
        setVisible(value !== 'yes');
    }, []);


    if (!visible) return null;

    return (
        <div className={'fixed bottom-0 left-0 w-full z-50 bg-black py-8'}>
            <div className={'text-center p-4'}>
                By clicking “Accept all cookies”, you agree Noodlebox can store cookies on your device and disclose
                information in accordance with our
                <a href="/privacy" target="_blank" className={'text-cyan-600 hover:text-cyan-500 hover:underline'}>Cookie
                    Policy</a>.
            </div>
            <div className={'flex items-center justify-center gap-4'}>
                <Button
                    className={'bg-cyan-500 hover:bg-cyan-600'}
                    onClick={() => {
                        localStorage.setItem('accepted-cookies', 'yes');
                        setVisible(false);
                    }}
                >Accept all cookies</Button>
                <Button onClick={() => {
                    localStorage.setItem('accepted-cookies', '');
                    setVisible(false);
                }}>Reject all cookies</Button>
            </div>
        </div>
    );
};

export default CookieClient;