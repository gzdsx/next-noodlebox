'use client';

import React, {useState} from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    App,
    Select,
    Pagination,
    Tag,
    DatePicker,
} from 'antd';
import {
    PrinterOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import dayjs from 'dayjs';

const {RangePicker} = DatePicker;

interface CashierTransactionType {
    id: number;
    user: {
        name: string;
    };
    actual_balance: string;
    driver_pm: string;
    shipping_total: string;
    online_total: string;
    card_total: string;
    cash_total: string;
    cost_total: string;
    refund_total: string;
    actual_total: string;
    total: string;
    net_total: string;
    status: string;
    created_at: string;
    links?: any;
}

export default function CashierTransactionsPage() {
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('cashierTransactions');

    const [total, setTotal] = useState<number>(0);
    const [transactions, setTransactions] = useState<CashierTransactionType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    const handlePrint = (record: CashierTransactionType) => {
        window.open(record.links?.invoice?.href, '_blank');
    };

    const columns: ColumnsType<CashierTransactionType> = [
        {
            title: t('cashier'),
            dataIndex: ['user', 'name'],
            key: 'user_name',
            width: 120,
            render: (name: string) => (
                <strong className={'text-gray-600'}>{name}</strong>
            ),
        },
        {
            title: t('float'),
            dataIndex: 'actual_balance',
            key: 'actual_balance',
            width: 100,
        },
        {
            title: t('pm'),
            dataIndex: 'driver_pm',
            key: 'driver_pm',
            width: 80,
        },
        {
            title: t('shippingTotal'),
            dataIndex: 'shipping_total',
            key: 'shipping_total',
            width: 120,
        },
        {
            title: t('onlineTotal'),
            dataIndex: 'online_total',
            key: 'online_total',
            width: 110,
        },
        {
            title: t('cardTotal'),
            dataIndex: 'card_total',
            key: 'card_total',
            width: 100,
        },
        {
            title: t('cashTotal'),
            dataIndex: 'cash_total',
            key: 'cash_total',
            width: 100,
        },
        {
            title: t('costTotal'),
            dataIndex: 'cost_total',
            key: 'cost_total',
            width: 100,
        },
        {
            title: t('refundTotal'),
            dataIndex: 'refund_total',
            key: 'refund_total',
            width: 100,
        },
        {
            title: t('handOnTotal'),
            dataIndex: 'actual_total',
            key: 'actual_total',
            width: 120,
        },
        {
            title: t('total'),
            dataIndex: 'total',
            key: 'total',
            width: 80,
        },
        {
            title: t('netTotal'),
            dataIndex: 'net_total',
            key: 'net_total',
            width: 100,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    open: 'processing',
                    closed: 'success',
                    pending: 'warning',
                };
                return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: tc('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
        },
        {
            title: tc('actions'),
            key: 'action',
            width: 100,
            align: 'end',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<PrinterOutlined/>}
                        onClick={() => handlePrint(record)}
                        className={'px-0!'}
                    >
                        {t('print')}
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchTransactions = () => {
        setLoading(true);
        const params: Record<string, unknown> = {offset, limit: 20};
        if (dateRange && dateRange[0] && dateRange[1]) {
            params.start_date = dateRange[0].format('YYYY-MM-DD');
            params.end_date = dateRange[1].format('YYYY-MM-DD');
        }
        apiGet('/casher/transactions', params).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setTransactions([...items]);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleBatchAction = () => {
        if (!batchAction || selectedItems.length === 0) return;

        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete(`/casher/transactions/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchTransactions();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchTransactions();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('transactionManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <RangePicker
                        onChange={(dates) => {
                            setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null);
                        }}
                        placeholder={[t('startDate'), t('endDate')]}
                    />
                    <Button type="primary" onClick={() => fetchTransactions()}>
                        {tc('search')}
                    </Button>
                </div>

                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    dataSource={transactions}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    rowKey={record => record.id}
                    scroll={{x: 1800}}
                />

                <div className={'flex justify-between items-center mt-4'}>
                    <div className={'grow flex flex-row gap-x-4'}>
                        <Select className={'w-40'} defaultValue={''} placeholder={tc('batchAction')}
                                onChange={(value) => setBatchAction(value)}
                                options={[
                                    {value: '', label: tc('batchAction')},
                                    {value: 'delete', label: tc('batchDelete')},
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
