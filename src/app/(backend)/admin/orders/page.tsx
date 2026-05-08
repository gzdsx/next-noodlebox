'use client';

import React, {useState} from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Tag,
    Input,
    Select,
    Pagination,
    Form,
    DatePicker
} from 'antd';
import {
    EyeOutlined, PrinterOutlined, ToolOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiDelete, apiGet, apiPut} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import {type Order as OrderType} from "@/types"
import {useMessage, useOrderProcessor} from "@/contexts/BackendAppContext";
import PaymentSelect from "@/components/backend/PaymentSelect";
import dayjs from "dayjs";
import DriverSelect from "@/components/backend/DriverSelect";

const {RangePicker} = DatePicker;

const statusMap: Record<string, { color: string; labelKey: string }> = {
    pending: {color: 'warning', labelKey: 'pending'},
    processing: {color: 'processing', labelKey: 'processing'},
    delivering: {color: 'cyan', labelKey: 'delivering'},
    completed: {color: 'success', labelKey: 'completed'},
    cancelled: {color: 'default', labelKey: 'cancelled'},
    refunded: {color: 'error', labelKey: 'refunded'},
};

const createViaMap: Record<string, string> = {
    web: 'WEB',
    app: 'App',
    pos: 'POS',
    ai: 'AI',
    '': 'Unknown',
}

export default function OrdersManagement() {
    const [total, setTotal] = useState<number>(0);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [filterParams, setFilterParams] = useState<any>({});

    const message = useMessage();
    const processor = useOrderProcessor();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('orders');

    const handleView = (record: OrderType) => {
        processor.open(record, fetchOrders);
    };

    const columns: ColumnsType<OrderType> = [
        {
            title: t('orderNo'),
            dataIndex: 'order_no',
            key: 'order_no',
            render: (orderNo: string, record) => (
                <div className={'flex flex-col'}>
                    <div
                        className={`font-bold cursor-pointer ${record.is_modified ? 'text-red-500' : 'text-gray-600'}`}
                        onClick={() => handleView(record)}
                    >
                        {orderNo}
                    </div>
                    <div>{record.shipping?.name}</div>
                    {
                        record.shipping?.phone_number && (
                            <div
                                className={'text-gray-500'}>+{record.shipping?.iddcode + record.shipping?.phone_number}</div>
                        )
                    }
                    <div className={'text-gray-500'}>{record.shipping?.address}</div>
                </div>
            ),
        },
        {
            title: 'Dirver',
            dataIndex: 'driver',
            key: 'driver',
            width: 180,
            align: 'center',
            render: (driver: string, record) => (
                <div className={'text-center'}>
                    <div
                        style={{color: record.deliveryer?.color ? record.deliveryer?.color : 'black'}}>{record.deliveryer?.name ? record.deliveryer?.name : '----'}</div>
                    <div className={'font-bold'}>{record.short_code}</div>
                </div>
            ),
        },
        {
            title: 'Shipping Method',
            dataIndex: 'shipping_method_title',
            key: 'shipping_method_title',
            width: 120,
        },
        {
            title: t('totalAmount'),
            dataIndex: 'total',
            key: 'total',
            width: 120,
            render: (amount: number | string, record) => (
                <div>
                    <div>{'€' + amount}</div>
                    <div
                        className={`text-ellipsis ${record.is_paid ? 'text-green-600' : 'text-gray-600'}`}>{record.payment_method_title}</div>
                </div>
            ),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 60,
            render: (status: string) => {
                const map = statusMap[status];
                return <Tag color={map?.color || 'default'}>{map ? t(map.labelKey) : status}</Tag>;
            },
        },
        {
            title: t('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
        },
        {
            title: 'CreatedV',
            dataIndex: 'created_via',
            key: 'created_via',
            width: 80,
            render: (created_via: string) => createViaMap[created_via]
        },
        {
            title: tc('actions'),
            key: 'action',
            width: 80,
            align: 'end',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined/>}
                        onClick={() => {
                            window.open(record.links?.invoice.href);
                        }}
                        className={'px-0!'}
                    >
                        {t('view')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        className={'px-0!'}
                        icon={<PrinterOutlined/>}
                        onClick={() => {
                            apiGet(`/orders/${record.id}/print`).then(() => {
                                message.success('订单加入打印列表成功');
                            }).catch(reason => {
                                message.error(reason.mesage);
                            }).finally(() => {

                            });
                        }}
                    >打印</Button>
                    <Button
                        type="link"
                        size="small"
                        className={'px-0!'}
                        icon={<ToolOutlined/>}
                        onClick={() => handleView(record)}
                    >处理</Button>
                </Space>
            ),
        },
    ];

    const fetchOrders = () => {
        setLoading(true);
        apiGet('/orders', {
            ...filterParams,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setOrders([...items]);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleSearch = () => {
        if (offset == 0) {
            fetchOrders();
        } else {
            setOffset(0);
        }
    }

    const handleBatchAction = () => {
        if (!batchAction) return;

        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete(`/orders/batch`, {
                ids: selectedItems
            }).then(() => {
                setSelectedItems([]);
                fetchOrders();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'cancel') {
            setLoading(true);
            apiPut(`/orders/batch`, {
                ids: selectedItems,
                data: {status: 'cancelled'},
            }).then(() => {
                message.success(t('cancelSuccess'));
                setSelectedItems([]);
                fetchOrders();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'complete') {
            setLoading(true);
            apiPut(`/orders/batch`, {
                ids: selectedItems,
                data: {status: 'completed'},
            }).then(() => {
                message.success(t('completeSuccess'));
                setSelectedItems([]);
                fetchOrders();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('orderManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', columnGap: 16, flexWrap: 'wrap'}}>
                    <Form.Item label={'订单号'}>
                        <Input
                            allowClear={true}
                            style={{width: 200}}
                            placeholder={'请输入订单号'}
                            onChange={e => {
                                setFilterParams((prev: any) => ({...prev, order_no: e.target.value}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'状态'}>
                        <Select
                            defaultValue="all"
                            style={{width: 200}}
                            options={[
                                {value: 'all', label: t('allStatus')},
                                {value: 'pending', label: t('pending')},
                                {value: 'processing', label: t('processing')},
                                {value: 'delivering', label: t('delivering')},
                                {value: 'completed', label: t('completed')},
                                {value: 'cancelled', label: t('cancelled')},
                                {value: 'refunded', label: t('refunded')},
                            ]}
                            onChange={value => {
                                setFilterParams((prev: any) => ({
                                    ...prev,
                                    status: value === 'all' ? '' : value
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'CreatedV'}>
                        <Select
                            defaultValue={'all'}
                            style={{width: 200}}
                            options={[
                                {label: '所有渠道', value: 'all'},
                                {label: 'WEB', value: 'web'},
                                {label: 'App', value: 'app'},
                                {label: 'POS', value: 'pos'},
                                {label: 'AI', value: 'ai'},
                            ]}
                            onChange={value => {
                                setFilterParams((prev: any) => ({
                                    ...prev,
                                    created_via: value === 'all' ? '' : value
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'ShippingM'}>
                        <Select
                            defaultValue={'all'}
                            style={{width: 200}}
                            options={[
                                {label: 'All Methods', value: 'all'},
                                {label: 'Delivery', value: 'flat_rate'},
                                {label: 'Collection', value: 'local_pickup'},
                                {label: 'Take Away', value: 'take_away'},
                            ]}
                            onChange={value => {
                                setFilterParams((prev: any) => ({
                                    ...prev,
                                    shipping_method: value === 'all' ? '' : value
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'日期'}>
                        <RangePicker
                            onChange={dates => {
                                if (dates && dates[0] && dates[1]) {
                                    setFilterParams((prev: any) => ({
                                        ...prev,
                                        start_date: dayjs(dates[0]).format('YYYY-MM-DD'),
                                        end_date: dayjs(dates[1]).format('YYYY-MM-DD'),
                                    }));
                                } else {
                                    setFilterParams((prev: any) => ({
                                        ...prev,
                                        start_date: '',
                                        end_date: '',
                                    }));
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'支付方式'}>
                        <PaymentSelect
                            defaultValue={[]}
                            style={{width: 200}}
                            onChange={value => {
                                if (value) {
                                    setFilterParams((prev: any) => ({
                                        ...prev,
                                        payments: value.join(',')
                                    }));
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'Driver'}>
                        <DriverSelect
                            style={{width: 200}}
                            defaultValue={'all'}
                            onChange={value => {
                                setFilterParams((prev: any) => ({
                                    ...prev,
                                    deliveryer: value === 'all' ? '' : value
                                }));
                            }}
                        />
                    </Form.Item>
                    <Button type={'primary'} onClick={handleSearch}>搜索</Button>
                </div>

                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    dataSource={orders}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    rowKey={record => record.id}
                />

                <div className={'flex justify-between items-center mt-4'}>
                    <div className={'grow flex flex-row gap-x-4'}>
                        <Select className={'w-40'} defaultValue={''} placeholder={tc('batchAction')}
                                onChange={(value) => setBatchAction(value)}
                                options={[
                                    {value: '', label: tc('batchAction')},
                                    {value: 'delete', label: tc('delete')},
                                    {value: 'cancel', label: t('batchCancel')},
                                    {value: 'complete', label: t('batchComplete')},
                                ]}
                        />
                        <Button type="primary" disabled={selectedItems.length === 0}
                                onClick={handleBatchAction}>{tc('apply')}</Button>
                    </div>
                    <Pagination
                        total={total}
                        pageSize={20}
                        showSizeChanger={false}
                        showTotal={(total) => tc('totalRecords', {total})}
                        onChange={(page, pageSize) => {
                            setOffset((page - 1) * pageSize);
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}
