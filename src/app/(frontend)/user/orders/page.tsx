import OrderHistoryList from '@/components/frontend/OrderHistoryList';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'My Orders - The Best Chinese Takeaway In Drogheda',
}

export default async function UserOrdersPage() {

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            <OrderHistoryList/>
        </div>
    );
}
