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
    Image,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost, apiPut, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import {useMediaLibrary} from "@/contexts/BackendAppContext";

interface BadgeType {
    id: number;
    icon: string;
    name: string;
    created_at?: string;
}

const BadgeClient = ({onSelect}: { onSelect?: (badges: BadgeType[]) => void }) => {
    const [items, setItems] = useState<BadgeType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<BadgeType | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [offset, setOffset] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [iconUrl, setIconUrl] = useState<string>('');

    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const mediaLibrary = useMediaLibrary();

    const fetchItems = () => {
        setLoading(true);
        apiGet('/badges', {
            offset,
            limit: 10,
        }).then(response => {
            const {items: data, total: t} = response.data;
            setItems(data || []);
            setTotal(t);
        }).catch(reason => {
            message.error(reason.message || 'Failed to fetch badges');
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchItems();
    }, [offset]);

    const handleAdd = () => {
        setEditingItem(null);
        setIconUrl('');
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record: BadgeType) => {
        setEditingItem(record);
        setIconUrl(record.icon || '');
        form.setFieldsValue({
            icon: record.icon,
            name: record.name,
        });
        setModalVisible(true);
    };

    const handleSelectIcon = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                setIconUrl(url);
                form.setFieldValue('icon', url);
            },
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await apiDelete(`/badges/${id}`);
            message.success('Delete successful');
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
        apiDelete(`/badges/batch`, {ids: selectedItems as number[]}).then(() => {
            message.success('Batch delete successful');
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
                await apiPut(`/badges/${editingItem.id}`, values);
                message.success('Update successful');
            } else {
                await apiPost('/badges', values);
                message.success('Create successful');
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

    const columns: ColumnsType<BadgeType> = [
        {
            title: 'Icon',
            dataIndex: 'icon',
            key: 'icon',
            width: 80,
            render: (icon: string) => (
                icon ? (
                    <Image
                        src={icon}
                        alt="badge"
                        width={40}
                        height={40}
                        style={{objectFit: 'contain', borderRadius: 4}}
                        preview={false}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                    />
                ) : null
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 'auto',
            render: (name: string) => (
                <strong className={'text-gray-600'}>{name}</strong>
            ),
        },
        {
            title: tc('actions'),
            key: 'action',
            width: 120,
            align: 'center',
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
                        title="Are you sure you want to delete this badge?"
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
                <h2></h2>
                <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                    添加Badge
                </Button>
            </div>

            <Card>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedItems([...selectedRowKeys]);
                            onSelect?.(selectedRows);
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
                title={editingItem ? 'Edit Badge' : 'Add Badge'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                confirmLoading={submitting}
                width={520}
                okText={tc('save')}
                cancelText={tc('cancel')}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" style={{marginTop: 16}}>
                    <Form.Item
                        name="icon"
                        label="Icon"
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 12,
                        }}>
                            {iconUrl && (
                                <Image
                                    src={iconUrl}
                                    alt="badge icon"
                                    width={60}
                                    height={60}
                                    style={{objectFit: 'contain', borderRadius: 4}}
                                    preview={false}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                                />
                            )}
                            <Button onClick={handleSelectIcon}>Select Icon</Button>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter badge name'}]}
                    >
                        <Input placeholder="Enter badge name"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export type {BadgeType};
export default BadgeClient;