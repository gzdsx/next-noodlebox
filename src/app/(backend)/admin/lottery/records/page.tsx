'use client';

import React, {useState} from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Input,
    Pagination,
    App,
    Select,
    Image,
} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';

const {Search} = Input;

interface LotteryRecordType {
    id: number;
    image: string;
    name: string;
    user: { name: string };
    created_at: string;
}

export default function LotteryRecordsPage() {
    const [total, setTotal] = useState<number>(0);
    const [records, setRecords] = useState<LotteryRecordType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('lotteryRecords');

    const columns: ColumnsType<LotteryRecordType> = [
        {
            title: t('image'),
            dataIndex: 'image',
            key: 'image',
            width: 80,
            render: (image: string) => (
                image ? (
                    <Image
                        src={image}
                        alt="prize"
                        width={48}
                        height={48}
                        style={{objectFit: 'cover', borderRadius: 4}}
                        preview={false}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                    />
                ) : null
            ),
        },
        {
            title: t('prizeName'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <strong className={'text-gray-600'}>{name}</strong>
            ),
        },
        {
            title: t('userName'),
            key: 'user',
            width: 160,
            render: (_, record) => record.user?.name || '-',
        },
        {
            title: t('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            align: 'end'
        },
    ];

    const fetchRecords = () => {
        setLoading(true);
        apiGet('/lottery/records', {
            q: searchText,
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
            apiDelete(`/lottery/records/batch`, {ids: selectedItems as number[]}).then(() => {
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
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('recordManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onChange={e=>setSearchText(e.target.value)}
                        onSearch={fetchRecords}
                        prefix={<SearchOutlined/>}
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
