import CartClient from '@/components/frontend/CartClient';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Cart - The Best Chinese Takeaway In Drogheda',
}

export default function CartPage() {
    return <CartClient/>;
}
