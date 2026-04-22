'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Empty, Spin } from 'antd';
import { apiGet } from '@/lib/api';
import { useTranslations } from '@/contexts/LocaleContext';

interface OrderItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail?: string;
    sku_name?: string;
}

interface Order {
    id: number;
    order_no: string;
    total: number;
    status: string;
    items: OrderItem[];
    created_at: string;
}

const statusMap: Record<string, { color: string; key: string }> = {
    pending: { color: 'orange', key: 'pending' },
    paid: { color: 'blue', key: 'paid' },
    shipped: { color: 'cyan', key: 'shipped' },
    completed: { color: 'green', key: 'completed' },
    cancelled: { color: 'red', key: 'cancelled' },
    refunded: { color: 'purple', key: 'refunded' },
};

export default function OrderHistoryList() {
    const {t} = useTranslations('ecommerce');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet('/orders')
            .then(response => {
                setOrders(response.data.items);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spin size="large"/>
            </div>
        );
    }

    if (orders.length === 0) {
        return <Empty description={t('order.noOrders')}/>;
    }

    return (
        <div className="space-y-4">
            {orders.map(order => {
                const statusInfo = statusMap[order.status] || { color: 'default', key: order.status };
                return (
                    <div key={order.id}
                         className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>{t('order.orderNo')}: {order.order_no}</span>
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <Tag color={statusInfo.color}>{t(`order.${statusInfo.key}`)}</Tag>
                        </div>

                        {/* Order Items */}
                        {order.items?.length > 0 && (
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-gray-700">{item.title}</p>
                                            {
                                                item.sku_name && (
                                                    <p className="text-gray-500">
                                                        {item.sku_name}
                                                    </p>
                                                )
                                            }
                                        </div>
                                        <span className="text-gray-500">
                                            ¥{item.price} × {item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order Total */}
                        <div className="flex justify-end mt-3 pt-3 border-t border-gray-50">
                            <span className="text-sm text-gray-500 mr-2">{t('order.total')}:</span>
                            <span className="font-semibold text-red-500">¥{order.total}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
