//'use server'

import {apiDelete, apiGet, apiPost, apiPut} from "@/lib/frontendApi";
import {CartItem} from "@/types";

export async function loadCarts() {
    const response = await apiGet("/carts")
    return response.data.items;
}

export async function addCartItem(item: CartItem) {
    const response = await apiPost("/carts", item)
    return response.data.id;
}

export async function removeCartItem(id: number) {
    const result = await apiDelete(`/carts/${id}`)
    return result.data;
}

export async function updateCartQuantity(id: number, quantity: number) {
    const result = await apiPut(`/carts/${id}`, {quantity})
    return result.data;
}