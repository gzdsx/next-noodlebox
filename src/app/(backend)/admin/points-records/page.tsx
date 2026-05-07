'use client';

import React, {useState} from 'react';
import {
    Table,
    Card,
    Button,
    Input,
    Pagination,
    App,
    Select,
} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';

const {Search} = Input;

interface TransactionType {
    id: number;
    user: { name: string };
    detail: string;
    points: number;
    type: number;
    balance: number;
    account_type: string;
    created_at: string;
}

export default function PointsRecordsPage() {
    const [total, setTotal] = useState<number>(0);
    const [records, setRecords] = useState<TransactionType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('pointsTransactions');

    const columns: ColumnsType<TransactionType> = [
        {
            title: t('userName'),
            key: 'user',
            width: 200,
            render: (_, record) => record.user?.name || '-',
        },
        {
            title: t('detail'),
            dataIndex: 'detail',
            key: 'detail',
            ellipsis: true,
        },
        {
            title: t('points'),
            dataIndex: 'points',
            key: 'points',
            width: 120,
            render: (points: number, record) => (
                record.type === 1
                    ? <span style={{color: '#52c41a'}}>+{points}</span>
                    : <span style={{color: '#ff4d4f'}}>-{points}</span>
            ),
        },
        {
            title: t('balance'),
            dataIndex: 'balance',
            key: 'balance',
            width: 120,
        },
        {
            title: t('accountType'),
            dataIndex: 'account_type',
            key: 'account_type',
            width: 140,
        },
        {
            title: t('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
        },
    ];

    const fetchRecords = () => {
        setLoading(true);
        apiGet('/users/points/transactions', {
            q: searchText,
            type: filterType === 'all' ? '' : filterType,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setRecords([...items]);
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
            apiDelete(`/users/points/transactions/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchRecords();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchRecords();
    }, [offset, filterType]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('transactionManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchRecords();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Select
                        defaultValue="all"
                        style={{width: 140}}
                        onChange={setFilterType}
                        options={[
                            {value: 'all', label: t('allTypes')},
                            {value: '1', label: t('typeIncome')},
                            {value: '2', label: t('typeExpense')},
                        ]}
                    />
                </div>

                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    dataSource={records}
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
