import OrderHistoryList from '@/components/frontend/OrderHistoryList';

export default async function UserOrdersPage() {

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            <OrderHistoryList/>
        </div>
    );
}
