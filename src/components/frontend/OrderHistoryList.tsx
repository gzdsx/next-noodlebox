'use client';

import React, {useEffect, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {EmptyState} from '@/components/ui/empty-state';
import {Spinner} from '@/components/ui/spinner';
import {apiGet, apiPost} from '@/lib/api';
import {useTranslations} from '@/contexts/LocaleContext';
import {Order, OrderItem} from "@/types";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useCart} from "@/contexts/CartContext";
import CustomPagination from "@/components/frontend/CustomPagination";
import {capitalize} from "@/lib/utils";
import {redirect} from "next/navigation";

const statusMap: Record<string, { color: string; key: string }> = {
    pending: {color: 'orange', key: 'pending'},
    processing: {color: 'blue', key: 'paid'},
    delivering: {color: 'cyan', key: 'shipped'},
    completed: {color: 'green', key: 'completed'},
    cancelled: {color: 'red', key: 'cancelled'},
    refunded: {color: 'purple', key: 'refunded'},
};

const statusBadgeClass: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100',
    green: 'bg-green-100 text-green-700 hover:bg-green-100',
    red: 'bg-red-100 text-red-700 hover:bg-red-100',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    default: '',
};

export default function OrderHistoryList() {
    const {reloadCart} = useCart();
    const {t} = useTranslations('ecommerce');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const renderOptions = (item: OrderItem) => {
        try {
            const names: string[] = [];
            const regex = /^(?!.*(none|original)).*$/i;
            if (Array.isArray(item.variations)) {
                item.variations?.forEach(option => {
                    if (regex.test(option.value || '')) {
                        names.push(option.value as string);
                    }
                });
            } else {
                Object.values(item.variations || {}).forEach(option => {
                    if (regex.test(option || '')) {
                        names.push(option as string);
                    }
                });
            }


            item.additional_options?.forEach(option => {
                if (regex.test(option.name)) {
                    names.push(option.name);
                }
            })
            return names.join(', ');
        } catch {
            return '';
        }
    }

    const handleRepurchase = async (orderId: number) => {
        try {
            await apiPost(`/orders/${orderId}/repurchase`);
            await reloadCart();
            await toast.success('Add to cart successfully');
        } catch (e) {
            console.log(e);
        }
    }

    const handlePayOrder = (orderId: number) => {
        apiPost(`/orders/${orderId}/create-paypal-order`, {
            return_url: window.location.origin + '/user/orders/paypal/capture'
        }).then(response => {
            //console.log('response', response.data);
            window.location.href = response.data.links[1].href;
        }).catch(e => {
            toast.error(e.message);
        })
    }

    const fetchOrders = async () => {
        apiGet('/orders', {
            offset,
            limit: 10
        }).then(response => {
            setOrders(response.data.items);
            setTotal(response.data.total);
        }).catch(() => {
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchOrders();
    }, [offset]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg"/>
            </div>
        );
    }

    if (orders.length === 0) {
        return <EmptyState description={t('order.noOrders')}/>;
    }

    return (
        <div className="space-y-4">
            {orders.map(order => {
                const statusInfo = statusMap[order.status] || {color: 'default', key: order.status};
                return (
                    <div key={order.id}
                         className="rounded-xl border border-gray-100/30 p-4 hover:shadow-sm transition-shadow">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                <span className={'hidden md:block'}>{t('order.orderNo')}: {order.order_no}</span>
                            </div>
                            <Badge variant="secondary" className={statusBadgeClass[statusInfo.color]}>
                                {capitalize(order.status)}
                            </Badge>
                        </div>

                        {/* Order Items */}
                        {order.items?.length > 0 && (
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-x-4 text-sm">
                                        <div>
                                            <img src={item.image} alt={item.title}
                                                 className="w-24 h-24 rounded-md object-cover"/>
                                        </div>
                                        <div className={'grow'}>
                                            <div className="text-[16px] font-medium">{item.title}</div>
                                            <div className={'text-[#6eacb1]'}>{renderOptions(item)}</div>
                                            {
                                                item.purchase_via === 'point' && (
                                                    <div className={'text-[#f19e39]'}>Purchase Via Points</div>
                                                )
                                            }
                                            {
                                                item.product_type === 'prize' && (
                                                    <div className={'text-[#f19e39]'}>Lottery Prize</div>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-right">€{item.price}</p>
                                            <p className="text-gray-300 text-right">{'×' + item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order Total */}
                        <div
                            className="flex justify-end items-center py-4 mt-4 text-gray-200 text-sm border-t border-gray-100/20">
                            <span>{t('order.total')}: {`€${order.total}`}</span>
                            <span>{`(Shipping Total: €${order.shipping_total})`}</span>
                        </div>

                        <div
                            className="flex justify-end items-center pt-4 gap-x-4 text-gray-200 text-sm border-t border-gray-100/20">
                            {
                                (order.payment_type === 'online' && !order.is_paid) && (
                                    <Button className={'bg-[#7cbcb8] hover:bg-[#2cbcb8]'} size={'sm'}
                                            onClick={() => handlePayOrder(order.id)}>Pay Now</Button>
                                )
                            }
                            <Button size={'sm'} onClick={() => handleRepurchase(order.id)}>Order Again</Button>
                        </div>
                    </div>
                );
            })}

            <CustomPagination total={total} currentPage={1} pageSize={10}
                              onChange={(page) => setOffset((page - 1) * 10)}/>
        </div>
    );
}
