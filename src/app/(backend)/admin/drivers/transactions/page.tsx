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
import ModalDriverTransaction from "@/components/backend/ModalDriverTransaction";

const {RangePicker} = DatePicker;

interface DriverTransactionType {
    id: number;
    deliveryer: {
        name: string;
    };
    base_amount: string;
    shipping_total: string;
    online_total: string;
    card_total: string;
    cash_total: string;
    cost_total: string;
    actual_total: string;
    status: string;
    created_at: string;
}

export default function DriverTransactionsPage() {
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('driverTransactions');

    const [total, setTotal] = useState<number>(0);
    const [transactions, setTransactions] = useState<DriverTransactionType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<any>({});

    const handlePrint = (record: DriverTransactionType) => {
        window.open(`/admin/drivers/transactions/${record.id}/print`, '_blank');
    };

    const columns: ColumnsType<DriverTransactionType> = [
        {
            title: t('driver'),
            dataIndex: ['deliveryer', 'name'],
            key: 'deliveryer_name',
            width: 120,
            render: (name: string,record) => (
                <strong className={'text-gray-600 cursor-pointer'} onClick={()=>{
                    setEditingTransaction(record);
                    setIsModalOpen(true);
                }}>{name}</strong>
            ),
        },
        {
            title: t('petrolMoney'),
            dataIndex: 'base_amount',
            key: 'base_amount',
            width: 120,
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
            title: t('handOn'),
            dataIndex: 'actual_total',
            key: 'actual_total',
            width: 100,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={status === 'settled' ? 'success' : 'warning'}>
                    {status === 'settled' ? t('statusSettled') : t('statusPending')}
                </Tag>
            ),
        },
        {
            title: tc('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
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
        apiGet('/deliveryer/transactions', params).then(response => {
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
            apiDelete(`/deliveryer/transactions/batch`, {ids: selectedItems as number[]}).then(() => {
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
                    scroll={{x: 1300}}
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
            {
                isModalOpen && (
                    <ModalDriverTransaction
                        transaction={editingTransaction}
                        onClose={() => setIsModalOpen(false)}
                        onSubmited={fetchTransactions}
                    />
                )
            }
        </div>
    );
}
