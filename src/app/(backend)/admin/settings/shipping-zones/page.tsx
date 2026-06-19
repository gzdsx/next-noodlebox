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
    InputNumber,
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
const {TextArea} = Input;

interface ShippingZoneType {
    id: number;
    title: string;
    description: string;
    fee: number;
    sort_num: number;
    created_at: string;
}

export default function ShippingZonesManagement() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('shippingZones');

    const [total, setTotal] = useState<number>(0);
    const [zones, setZones] = useState<ShippingZoneType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ShippingZoneType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: ShippingZoneType) => {
        setEditingRecord(record);
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            fee: record.fee,
            sort_num: record.sort_num,
        });
        setModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingRecord) {
                await apiPut(`/shipping-zones/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/shipping-zones', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchZones();
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

    const columns: ColumnsType<ShippingZoneType> = [
        {
            title: t('name'),
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (title: string) => (
                <strong className={'text-gray-600'}>{title}</strong>
            ),
        },
        {
            title: t('description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: t('fee'),
            dataIndex: 'fee',
            key: 'fee',
            width: 140,
        },
        {
            title: 'Order',
            dataIndex: 'sort_num',
            key: 'sort_num',
            width: 100,
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

    const fetchZones = () => {
        setLoading(true);
        apiGet('/shipping-zones', {
            q: searchText,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setZones([...items]);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleBatchAction = () => {
        if (!batchAction) return;

        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete(`/shipping-zones/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchZones();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchZones();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('shippingZoneManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchZones();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addShippingZone')}
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
                    dataSource={zones}
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
                title={editingRecord ? t('editShippingZone') : t('addShippingZone')}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                okText={tc('save')}
                cancelText={tc('cancel')}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label={t('name')}
                        name="title"
                        rules={[{required: true, message: t('nameRequired')}]}
                    >
                        <Input placeholder={t('namePlaceholder')}/>
                    </Form.Item>

                    <Form.Item
                        label={t('description')}
                        name="description"
                    >
                        <TextArea rows={3} placeholder={t('descriptionPlaceholder')}/>
                    </Form.Item>

                    <Form.Item
                        label={t('fee')}
                        name="fee"
                        rules={[{required: true, message: t('feeRequired')}]}
                    >
                        <InputNumber
                            min={0}
                            precision={2}
                            style={{width: '100%'}}
                            placeholder={t('feePlaceholder')}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Order'}
                        name="sort_num"
                    >
                        <InputNumber
                            min={0}
                            precision={2}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
