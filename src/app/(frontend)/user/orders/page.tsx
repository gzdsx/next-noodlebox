import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from '@/lib/i18n';
import OrderHistoryList from '@/components/frontend/OrderHistoryList';

export default async function UserOrdersPage() {
    const session = await auth();
    if (!session) redirect('/login');
    const { t } = getTranslations('ecommerce');

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('page.myOrders')}</h1>
            <OrderHistoryList/>
        </div>
    );
}
