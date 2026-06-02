'use client';

import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, Spin, Tag} from "antd";
import {apiGet} from "@/lib/backendApi";
import {useMessage, useOrderProcessor} from "@/contexts/BackendAppContext";
import dayjs from "dayjs";
import {capitalize} from "@/lib/utils";
import {useThrottleFn} from "ahooks";
import {useEchoPublic} from "@laravel/echo-react";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";

export default function Page() {
    const message = useMessage();
    const router = useRouter();
    const processor = useOrderProcessor();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [status, setStatus] = useState('processing');
    const [stats, setStats] = useState<any>({
        completed: 0,
        processing: 0
    });
    //const [currentOrder, setCurrentOrder] = useState<any>({});

    const fetchOrders = () => {
        setLoading(true);
        apiGet(`/orders`, {
            status,
            shipping_method: 'local_pickup',
            only_today: true,
            limit: 100
        }).then(response => {
            setOrders(response.data.items);
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchStats = () => {
        apiGet(`/orders/stats`, {
            status,
            shipping_method: 'local_pickup',
            only_today: true,
        }).then(response => {
            setStats((prevState: any) => ({...prevState, ...response.data}));
        });
    }

    const orderTotal: string = useMemo(() => {
        return orders.reduce((total: number, order) => total + Number(order.total), 0).toFixed(2);
    }, [orders]);

    const {run: refreshOrders} = useThrottleFn(() => {
        fetchOrders();
        fetchStats();
    }, {wait: 2000});

    useEchoPublic('noodlebox', '.order.created', (data: any) => {
        //console.log('order.created', data);
        refreshOrders();
    });

    useEchoPublic('noodlebox', '.order.changed', (data: any) => {
        //console.log('order.created', data);
        refreshOrders();
    });

    useEchoPublic('noodlebox', '.order.deleted', (data: any) => {
        //console.log('order.created', data);
        refreshOrders();
    });

    useEffect(() => {
        setTimeout(() => {
            fetchOrders();
            fetchStats();
        });
    }, [status]);

    return (
        <>
            <div className={'flex justify-between mb-4 items-center'}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => router.push('/admin/orders/pilot')}
                />
                <h2 style={{fontSize: 24, fontWeight: 'bold'}}>Collection Orders (Order Total:€{orderTotal})</h2>
                <div className={'flex gap-2'}>
                    <Button variant={'solid'} color={'yellow'}
                            onClick={() => setStatus('processing')}>Processing({stats.processing})</Button>
                    <Button variant={'solid'} color={'green'}
                            onClick={() => setStatus('completed')}>Completed({stats.completed})</Button>
                </div>
            </div>
            <Card>
                <Spin spinning={loading}>
                    <div className={'grid grid-cols-2 md:grid-cols-4 gap-4'}>
                        {
                            orders.map((order: any) => (
                                <div
                                    key={`order-${order.id}`}
                                    className={'border border-gray-200 rounded-md p-2 flex flex-col gap-y-1 cursor-pointer'}
                                    onClick={() => processor.open(order, refreshOrders)}
                                >
                                    <div className={'grid grid-cols-[80px_1fr] gap-1'}>
                                        <div className={'font-bold'}>OrderN</div>
                                        <div className={'font-bold'}>{order.short_code}</div>
                                    </div>
                                    <div className={'grid grid-cols-[80px_1fr] gap-1'}>
                                        <div className={'font-bold'}>OrderD</div>
                                        <div>{dayjs(order.created_at).format('MM/DD/YY HH:mm')}</div>
                                    </div>
                                    <div className={'grid grid-cols-[80px_1fr] gap-1'}>
                                        <div className={'font-bold'}>OrderS</div>
                                        <div>
                                            <Tag
                                                color={order.status === 'completed' ? 'green' : 'yellow'}>{capitalize(order.status)}</Tag>
                                        </div>
                                    </div>
                                    <div className={'grid grid-cols-[80px_1fr] gap-1'}>
                                        <div className={'font-bold'}>Customer</div>
                                        <div>
                                            <div>{order.shipping.name}</div>
                                            <div>{order.shipping.phone_number}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Spin>
            </Card>
        </>
    )
}