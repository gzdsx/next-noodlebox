'use client';


import React, {useEffect, useState} from 'react';
import {apiGet, apiPost} from "@/lib/backendApi";
import {Card, Modal, Spin} from "antd";
import {useMessage} from "@/contexts/BackendAppContext";
import dayjs from "dayjs";

const ModalDriverOrders = ({driver, onConfirm, onCancel}: {
    driver: any,
    onConfirm: () => void,
    onCancel: () => void
}) => {
    const message = useMessage();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [submiting, setSubmiting] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await apiGet(`/deliveryers/${driver.id}/unsettledorders`);
            setOrders(response.data.items);
        } catch (e: any) {
            message.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    const handleRevoke = () => {
        if (selectedOrders.length === 0) {
            onCancel();
            return;
        }
        if (submiting) {
            return;
        }
        setSubmiting(true);
        apiPost(`/orders/revoke`, {
            orders: selectedOrders
        }).then(() => {
            onConfirm();
            onCancel();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setSubmiting(false);
        })
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Modal
            open={true}
            title={driver.name}
            width={'80%'}
            onOk={handleRevoke}
            onCancel={onCancel}
            okButtonProps={{loading: submiting}}
            cancelButtonProps={{disabled: submiting}}
            okText={'Revoke'}
        >
            <Card loading={loading}>
                <Spin spinning={submiting}>
                    <div className={'grid grid-cols-2 md:grid-cols-4 gap-4'}>
                        {
                            orders?.map(order => {
                                const checked = selectedOrders.includes(order.id);
                                return (
                                    <div key={order.id}
                                         className={`border border-gray-200 rounded-md flex flex-col gap-y-1 pb-1 cursor-pointer ${checked ? 'bg-gray-400' : ''}`}
                                         onClick={() => {
                                             if (checked) {
                                                 setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                             } else {
                                                 setSelectedOrders([...selectedOrders, order.id]);
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
                                            <div style={{wordBreak: 'break-word'}}>{order.shipping?.address}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Spin>
            </Card>
        </Modal>
    );
};

export default ModalDriverOrders;