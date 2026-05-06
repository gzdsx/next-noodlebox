'use client';

import React, {useState} from 'react';
import {useTranslations} from '@/contexts/LocaleContext';
import SmsLoginClient from "@/components/frontend/SmsLoginCilent";
import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import PasswordLoginClient from "@/components/frontend/PasswordLoginClient";
import SocialLoginClient from "@/components/frontend/SocialLoginClient";

export default function LoginClient() {
    const {t} = useTranslations('ecommerce');
    const [loginType, setLoginType] = useState('sms');

    const activeClass = 'bg-red-500 text-white';
    const inactiveClass = 'bg-white text-gray-500';

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-2xl text-white font-bold">{t('auth.login')}</h1>
                <p className="text-sm text-gray-200 mt-2">{'Welcome to Noodle Box'}</p>
            </div>
            <ButtonGroup className={'w-full mb-8'}>
                <Button
                    onClick={() => setLoginType('sms')}
                    className={`grow ${loginType === 'sms' ? activeClass : inactiveClass} hover:text-white`}>Button
                    By SMS OPT</Button>
                <Button
                    onClick={() => setLoginType('password')}
                    className={`grow ${loginType === 'password' ? activeClass : inactiveClass} hover:text-white`}>Button
                    By Password</Button>
            </ButtonGroup>
            {
                loginType === 'sms' ? <SmsLoginClient/> : <PasswordLoginClient/>
            }
            <div className={'text-center py-2'}>
                <a className={'text-[#4ba181] hover:underline'}>Forget password?</a>
                <span className={'mx-2 text-white'}>or</span>
                <a href={'/auth/register'} className={'text-[#4ba181] hover:underline'}>Registration</a>
            </div>
            <div className={'mt-10'}>
                <SocialLoginClient/>
            </div>
        </div>
    );
}
