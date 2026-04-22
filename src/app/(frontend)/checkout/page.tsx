import CheckoutClient from '@/components/frontend/CheckoutClient';
import {apiGet} from "@/lib/api";

const getAddress = async () => {
    try {
        const response = await apiGet('/user/address');
        return response.data.items;
    } catch {
        return [];
    }
};

export default async function CheckoutPage() {
    const addresses = await getAddress();
    return <CheckoutClient/>;
}
