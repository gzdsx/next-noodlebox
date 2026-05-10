'use client';

import React, {useState, useEffect} from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Pagination,
    App,
    Popconfirm,
    Select,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost, apiPut, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';

interface AddressBookType {
    id: number;
    eircode: string;
    address: string;
    created_at?: string;
}

export default function AddressBookManagement() {
    const [items, setItems] = useState<AddressBookType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<AddressBookType | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [offset, setOffset] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('addressbook');

    const fetchItems = () => {
        setLoading(true);
        apiGet('/addressbooks', {
            offset,
            limit: 20,
        }).then(response => {
            const {items: data, total: t} = response.data;
            setItems(data || []);
            setTotal(t);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchItems();
    }, [offset]);

    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record: AddressBookType) => {
        setEditingItem(record);
        form.setFieldsValue({
            eircode: record.eircode,
            address: record.address,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await apiDelete(`/addressbooks/${id}`);
            message.success(tc('deleteSuccess'));
            fetchItems();
        } catch (reason: unknown) {
            if (reason instanceof Error) {
                message.error(reason.message);
            }
        }
    };

    const handleBatchDelete = () => {
        if (selectedItems.length === 0) return;
        setLoading(true);
        apiDelete(`/addressbooks/batch`, {ids: selectedItems as number[]}).then(() => {
            message.success(tc('deleteSuccess'));
            setSelectedItems([]);
            setBatchAction('');
            fetchItems();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingItem) {
                await apiPut(`/addressbooks/${editingItem.id}`, values);
                message.success(tc('saveSuccess'));
            } else {
                await apiPost('/addressbooks', values);
                message.success(tc('saveSuccess'));
            }
            setModalVisible(false);
            fetchItems();
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnsType<AddressBookType> = [
        {
            title: t('eircode'),
            dataIndex: 'eircode',
            key: 'eircode',
            width: 120,
        },
        {
            title: t('address'),
            dataIndex: 'address',
            key: 'address',
            width: 'auto',
        },
        {
            title: tc('actions'),
            key: 'action',
            width: 120,
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
                    <Popconfirm
                        title={tc('deleteConfirm')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={tc('confirm')}
                        cancelText={tc('cancel')}
                    >
                        <Button type="link" size="small" danger icon={<DeleteOutlined/>} className={'px-0!'}>
                            {tc('delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                <h2 style={{fontSize: 24, fontWeight: 'bold', margin: 0}}>{t('addressBookManagement')}</h2>
                <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                    {t('addAddress')}
                </Button>
            </div>

            <Card>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    dataSource={items}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    rowKey={record => record.id}
                />

                <div className={'flex justify-between items-center mt-4'}>
                    <div className={'grow flex flex-row gap-x-4'}>
                        <Select
                            className={'w-40'}
                            defaultValue={''}
                            placeholder={tc('batchAction')}
                            onChange={(value) => setBatchAction(value)}
                            options={[
                                {value: '', label: tc('batchAction')},
                                {value: 'delete', label: tc('delete')},
                            ]}
                        />
                        <Button
                            type="primary"
                            danger
                            disabled={selectedItems.length === 0 || batchAction !== 'delete'}
                            onClick={handleBatchDelete}
                        >
                            {tc('confirm')}
                        </Button>
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
                title={editingItem ? t('editAddress') : t('addAddress')}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                confirmLoading={submitting}
                width={520}
                okText={tc('save')}
                cancelText={tc('cancel')}
            >
                <Form form={form} layout="vertical" style={{marginTop: 16}}>
                    <Form.Item
                        name="eircode"
                        label={t('eircode')}
                        rules={[
                            {required: true, message: t('eircodeRequired')},
                            {pattern: /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/i, message: t('eircodeInvalid')},
                        ]}
                    >
                        <Input placeholder={t('eircodePlaceholder')} style={{textTransform: 'uppercase'}}/>
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label={t('address')}
                        rules={[{required: true, message: t('addressRequired')}]}
                    >
                        <Input.TextArea rows={4} placeholder={t('addressPlaceholder')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}