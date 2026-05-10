'use client';

import React, {useEffect, useMemo, useState} from "react";
import {Card, Layout, Spin, Tag} from "antd";
import {apiGet, apiPost} from "@/lib/backendApi";
import {useMessage, useModal} from "@/contexts/BackendAppContext";
import SortableProvider from "@/components/common/SortableProvider";
import {useSortable} from "@dnd-kit/react/sortable";
import dayjs from "dayjs";
import {arrayMove} from "@dnd-kit/sortable";
import {useThrottleFn} from "ahooks";
import {useEchoPublic} from "@laravel/echo-react";

const {Content, Sider} = Layout;

function SortableCard({id, index, children, checked = false, onClick}: {
    id: string;
    index: number;
    children: React.ReactNode;
    checked?: boolean;
    onClick?: () => void;
}) {
    const {ref} = useSortable({
        id,
        index,
        transition: {duration: 250, easing: 'ease'},
    });

    return (
        <div ref={ref}
             onClick={onClick}
             className={`border border-gray-200 rounded-md flex flex-col gap-y-1 pb-1 ${checked ? 'bg-gray-100' : ''}`}>
            {children}
        </div>
    )
}

export default function Page() {
    const modal = useModal();
    const message = useMessage();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = () => {
        apiGet(`/orders`, {
            deliveryer: 0,
            status: 'processing',
            shipping_method: 'flat_rate',
            allocated: 'no',
            limit: 100
        }).then(response => {
            setOrders(response.data.items);
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchDrivers = () => {
        apiGet(`/deliveryers`, {status: 'online'}).then(response => {
            setDrivers(
                response.data.items.map((item: any) => ({
                    ...item,
                    orders: []
                }))
            )
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleAllocate = (driver: any) => {
        const ids = selectedItems.map(item => item.id);
        setDrivers(prevState => prevState.map(item => item.id === driver.id ? {
            ...item,
            orders: [...new Set([...item.orders, ...ids])]
        } : item));
        //setOrders(prevState => prevState.filter(item => !ids.includes(item.id)));
        setSelectedItems([]);
    }

    const handleSetOut = (driver: any) => {
        if (driver.orders.length === 0) {
            return;
        }

        setLoading(true);
        apiPost(`/orders/allocate`, {
            deliveryer_id: driver.id,
            orders: driver.orders
        }).then(() => {
            setDrivers(prevState => prevState.map(item => item.id === driver.id ? {
                ...item,
                orders: []
            } : item));
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleRemoveOrder = (driver: any, id: any) => {
        modal.confirm({
            title: 'Confirm',
            content: 'Are you sure to remove this order?',
            onOk: () => {
                setDrivers(prevState => prevState.map(item => item.id === driver.id ? {
                    ...item,
                    orders: item.orders.filter((c: any) => c !== id)
                } : item));
            }
        })
    }

    const handleSortEnd = (oldIndex: number, newIndex: number) => {
        const orders = arrayMove(filteredOrders, oldIndex, newIndex).map(item => item.id);
        apiPost('/orders/sort', {
            orders
        }).then(() => {
            message.success('Sort success');
        }).catch(reason => {
            message.error(reason.message);
        });
    }

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const filteredOrders = useMemo(() => {
        const assignedOrderIds = drivers.flatMap(driver => driver.orders);
        return orders.filter(order => !assignedOrderIds.includes(order.id));
    }, [drivers, orders]);

    const {run: refreshOrders} = useThrottleFn(() => {
        fetchOrders();
    }, {wait: 2000});

    useEchoPublic('noodlebox', '.order.created', (data: any) => {
        //console.log('order.created', data);
        refreshOrders();
    });

    useEffect(() => {
        fetchOrders();
        fetchDrivers();
    }, []);

    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>Order Allocation</h2>
            <Card>
                <Layout style={{backgroundColor: '#fff'}}>
                    <Sider style={{backgroundColor: '#fff'}} width={205}>
                        <div className={'flex flex-col gap-2'}>
                            {
                                drivers.map(driver => (
                                    <div key={driver.id}
                                         className={'border border-gray-200 rounded-md overflow-hidden'}>
                                        <div
                                            className={'font-bold text-center bg-cyan-600 text-white py-2'}>{driver.name}</div>
                                        <div className={'p-2 font-bold text-wrap flex flex-wrap gap-2'}>
                                            {driver.orders.map((c: string) => (
                                                <Tag key={c}
                                                     className={'cursor-pointer'}
                                                     onClick={() => handleRemoveOrder(driver, c)}>{c}</Tag>
                                            ))}
                                        </div>
                                        <div className={'flex border-t border-gray-200'}>
                                            <div
                                                className={'grow py-2 text-center cursor-pointer'}
                                                onClick={() => handleAllocate(driver)}
                                            >+Orders
                                            </div>
                                            <div
                                                className={'grow py-2 text-center cursor-pointer border-l border-gray-200'}
                                                onClick={() => handleSetOut(driver)}>Set out
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Sider>
                    <Content className={'pl-4'}>
                        <SortableProvider onSortEnd={handleSortEnd}>
                            <div className={'grid grid-cols-2 md:grid-cols-4 gap-4'}>
                                {
                                    filteredOrders.map((order, index) => (
                                        <SortableCard
                                            key={`order-${order.id}`}
                                            id={`order-${order.id}`}
                                            index={index}
                                            checked={selectedItems.includes(order)}
                                            onClick={() => {
                                                if (selectedItems.includes(order)) {
                                                    setSelectedItems(prevState => prevState.filter(item => item.id !== order.id));
                                                } else {
                                                    setSelectedItems(prevState => [...prevState, order]);
                                                }
                                            }}
                                        >
                                            <div
                                                className={'text-center font-bold bg-gray-200 py-2'}>{order.short_code}</div>
                                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                                <div className={'font-bold'}>OrderTime</div>
                                                <div>{dayjs(order.created_at).format('MM/DD/YY HH:mm')}</div>
                                            </div>
                                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                                <div className={'font-bold'}>ShippingF</div>
                                                <div>{order.shipping_total}</div>
                                            </div>
                                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                                <div className={'font-bold'}>ShippingM</div>
                                                <div>{order.shipping_method_title}</div>
                                            </div>
                                            <div className={'grid gap-2 grid-cols-[80px_1fr] px-2'}>
                                                <div className={'font-bold'}>ShippingT</div>
                                                <div>{order.shipping?.address}</div>
                                            </div>
                                        </SortableCard>
                                    ))
                                }
                            </div>
                        </SortableProvider>
                    </Content>
                </Layout>
            </Card>
            {
                loading && (
                    <Spin fullscreen={true}/>
                )
            }
        </>
    )
}