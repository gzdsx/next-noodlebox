'use server'

import {CartItem} from "@/types";
import {apiDelete, apiGet, apiPost, apiPut} from "@/lib/api";

export async function loadCarts() {
    try {
        const response = await apiGet("/carts");
        return response.data.items;
    } catch {
        return [];
    }
}

export async function addCartItem(item: CartItem) {
    try {
        const response = await apiPost("/carts", item)
        return response.data.id;
    } catch {
        return null;
    }
}

export async function removeCartItem(id: number) {
    try {
        const result = await apiDelete(`/carts/${id}`)
        return result.data;
    } catch {
        return null;
    }
}

export async function updateCartQuantity(id: number, quantity: number) {
    try {
        const result = await apiPut(`/carts/${id}`, {quantity})
        return result.data;
    } catch {
        return {};
    }
}