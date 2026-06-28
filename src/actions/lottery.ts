'use server'

import {apiGet} from "@/lib/api";

export async function getLotteryOptions() {
    try {
        const response = await apiGet("/lottery/settings")
        return response.data;
    } catch {
        return {}
    }
}

export async function getLotteryResult() {
    return await apiGet(`/lottery/draw`);
}