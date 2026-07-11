'use server'

import {apiPost} from "@/lib/api";

export async function sendSmsCode(iddcode: string, phone_number: string) {
    return apiPost('/captcha/sms', {
        iddcode: iddcode,
        phone_number: phone_number,
    });
}