'use server'

import {getSession} from "next-auth/react";
import {apiDelete, apiGet, apiPost, apiPut} from "@/lib/api";
import {CartItem} from "@/types";

async function getToken() {
    const session = await getSession();
    return (session as any)?.accessToken
}

export async function loadCarts() {
    const token = await getToken();
    if (token) {
        const response = await apiGet("/carts")
        return response.data.items
    }

    return []
}

export async function addCartItem(item: CartItem) {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (token) {
        const response = await apiPost("/carts", item)
        return response.data.id;
    }
    return null;
}

export async function removeCartItem(id: number) {
    const token = await getToken();
    if (token) {
        await apiDelete(`/carts/${id}`)
        return true;
    }
    return false;
}

export async function updateCartQuantity(id: number, quantity: number) {
    const token = await getToken();
    if (token) {
        await apiPut(`/carts/${id}`, {quantity})
        return true;
    }
    return false;
}