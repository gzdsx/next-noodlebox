'use server'

import {apiGet} from "@/lib/api";

export async function fetchOptions() {
    try {
        const response = await apiGet("/options")
        return response.data.items;
    } catch {
        return [];
    }
}