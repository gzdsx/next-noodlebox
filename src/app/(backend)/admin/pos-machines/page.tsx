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
    Modal,
    Form,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost, apiPut, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';

const {Search} = Input;

interface PosMachineType {
    id: number;
    name: string;
    base_amount: string;
    status: string;
    created_at: string;
}

export default function PosMachinesPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('posMachines');

    const [total, setTotal] = useState<number>(0);
    const [machines, setMachines] = useState<PosMachineType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PosMachineType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: PosMachineType) => {
        setEditingRecord(record);
        form.setFieldsValue({
            name: record.name,
            base_amount: record.base_amount,
            status: record.status,
        });
        setModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingRecord) {
                await apiPut(`/pos-machines/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/pos-machines', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchMachines();
        } catch (e: unknown) {
            if (e instanceof Error) {
                message.error(e.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setModalOpen(false);
        form.resetFields();
    };

    const columns: ColumnsType<PosMachineType> = [
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <strong className={'text-gray-600'}>{name}</strong>
            ),
        },
        {
            title: t('baseAmount'),
            dataIndex: 'base_amount',
            key: 'base_amount',
            width: 140,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const color = status === 'idle' ? 'default' : 'processing';
                const label = status === 'idle' ? t('statusIdle') : t('statusInuse');
                return <Tag color={color}>{label}</Tag>;
            },
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
                        icon={<EditOutlined/>}
                        onClick={() => handleEdit(record)}
                        className={'px-0!'}
                    >
                        {tc('edit')}
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchMachines = () => {
        setLoading(true);
        apiGet('/pos-machines', {
            q: searchText,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setMachines([...items]);
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
            apiDelete(`/pos-machines/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchMachines();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchMachines();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('posMachineManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchMachines();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addPosMachine')}
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
                    dataSource={machines}
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

            <Modal
                title={editingRecord ? t('editPosMachine') : t('addPosMachine')}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                okText={tc('save')}
                cancelText={tc('cancel')}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item
                        label={t('name')}
                        name="name"
                        rules={[{required: true, message: t('nameRequired')}]}
                    >
                        <Input placeholder={t('namePlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('baseAmount')} name="base_amount">
                        <Input placeholder={t('baseAmountPlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('status')} name="status">
                        <Select
                            placeholder={t('statusPlaceholder')}
                            options={[
                                {value: 'idle', label: t('statusIdle')},
                                {value: 'inuse', label: t('statusInuse')},
                            ]}
                            allowClear
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
