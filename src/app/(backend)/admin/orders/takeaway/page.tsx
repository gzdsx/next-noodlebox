'use client';

import {Button, Card, Spin, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {apiGet, apiPut} from "@/lib/backendApi";
import dayjs from "dayjs";
import {capitalize} from "@/lib/utils";
import {ArrowLeftOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {useMessage} from "@/contexts/BackendAppContext";
import {useThrottleFn} from "ahooks";
import {useEchoPublic} from "@laravel/echo-react";
import {useRouter} from "next/navigation";

export default function Page() {
    const message = useMessage();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({
        pending: 0,
        setout: 0,
        cancelled: 0
    });
    const [filterParams, setFilterParams] = useState<any>({
        serving_status: 'pending',
        order_direction: 'asc',
        limit: 100,
        offset: 0
    });
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [submiting, setSubmiting] = useState(false);

    const fetchOrders = () => {
        apiGet(`/pilot/orders`, filterParams).then(response => {
            //console.log(response.data);
            setOrders(response.data.items);
            setStats(response.data.stats);
        });
    }

    const processOrders = () => {
        setSubmiting(true);
        apiPut(`/pilot/orders/batch`, {
            ids: selectedItems
        }).then(() => {
            message.success('Order processed');
            setSelectedItems([]);
            fetchOrders();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setSubmiting(false);
        })
    }

    const restoreOrders = () => {
        setSubmiting(true);
        apiPut(`/pilot/orders/restore`, {
            ids: selectedItems
        }).then(() => {
            message.success('Order restored');
            setSelectedItems([]);
            fetchOrders();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setSubmiting(false);
        });
    }

    const {run: refreshOrders} = useThrottleFn(() => {
        fetchOrders();
    }, {wait: 2000});

    useEchoPublic('noodlebox', '.order.created', (data: any) => {
        //console.log('order.created', data);
        refreshOrders();
    });

    useEffect(() => {
        fetchOrders();
    }, [filterParams]);
    return (
        <>
            <div className={'flex justify-between mb-4 items-center'}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => router.push('/admin/orders/pilot')}
                    className={'font-bold'}
                />
                <h2 style={{fontSize: 24, fontWeight: 'bold'}}>Takeaway Orders</h2>
                <div className={'flex gap-2'}>
                    <Button
                        variant={'solid'}
                        color={'yellow'}
                        onClick={() => {
                            setFilterParams((prevState: any) => ({
                                ...prevState,
                                serving_status: 'pending',
                                order_direction: 'asc'
                            }));
                        }}>Pending({stats.pending})</Button>
                    <Button
                        variant={'solid'}
                        color={'green'}
                        onClick={() => {
                            setFilterParams((prevState: any) => ({
                                ...prevState,
                                serving_status: 'setout',
                                order_direction: 'desc'
                            }));
                        }}>Done({stats.setout})</Button>
                </div>
            </div>
            <Card>
                <div className={'grid grid-cols-4 md:grid-cols-4 gap-4'}>
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className={`border border-gray-200 rounded-md flex flex-col gap-y-1 pb-1 relative cursor-pointer`}
                            onClick={() => {
                                if (selectedItems.includes(order.id)) {
                                    setSelectedItems(prevState => prevState.filter(item => item !== order.id));
                                } else {
                                    setSelectedItems(prevState => [...prevState, order.id]);
                                }
                            }}
                        >
                            <div
                                className={'text-center font-bold bg-gray-200 py-2 text-2xl'}>{order.short_code}</div>
                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                <div className={'font-bold'}>OrderS</div>
                                <div>
                                    <Tag
                                        color={order.dish_status === 'done' ? 'green' : 'yellow'}>{capitalize(order.dish_status)}</Tag>
                                </div>
                            </div>
                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                <div className={'font-bold'}>OrderTime</div>
                                <div>{dayjs(order.created_at).format('MM/DD/YY HH:mm')}</div>
                            </div>
                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                <div className={'font-bold'}>Customer</div>
                                <div>
                                    <div className={'font-bold'}>{order.shipping?.name}</div>
                                    <div>{order.shipping?.phone_number}</div>
                                </div>
                            </div>
                            {
                                selectedItems.includes(order.id) && (
                                    <div
                                        className={'absolute bg-black/30 top-0 right-0 flex items-center justify-center w-full h-full p-2'}>
                                        <CheckCircleOutlined style={{color: 'white', fontSize: 24}}/>
                                    </div>
                                )
                            }
                        </div>
                    ))}
                </div>
            </Card>
            {
                selectedItems.length > 0 && (
                    <div className={'flex justify-center items-center mt-4 fixed bottom-6 left-0 right-0'}>
                        {
                            filterParams.serving_status === 'setout' ? (
                                <Button style={{width: 100}} variant={'solid'} color={'red'} onClick={restoreOrders}>Restore</Button>
                            ) : (
                                <Button style={{width: 100}} variant={'solid'} color={'green'} onClick={processOrders}>Done</Button>
                            )
                        }
                    </div>
                )
            }
            {
                submiting && (
                    <Spin fullscreen={true} size={'large'}/>
                )
            }
        </>
    )
}