import CheckoutClient from '@/components/frontend/CheckoutClient';
import {apiGet} from "@/lib/api";
import PaypalProvider from "@/providers/PaypalProvider";

const getOptions = async () => {
    try {
        const response = await apiGet('/checkout/options');
        return response.data;
    } catch {
        return {};
    }
}

export default async function CheckoutPage() {
    //const addresses = await getAddress();
    const options = await getOptions();
    return (
        <PaypalProvider>
            <CheckoutClient options={options}/>
        </PaypalProvider>
    );
}
