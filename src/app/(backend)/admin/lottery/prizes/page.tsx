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
    Image,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost, apiPut, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import {useMediaLibrary} from "@/contexts/BackendAppContext";

const {Search} = Input;

interface PrizeType {
    id: number;
    image: string;
    name: string;
    type: string;
    points: string;
    stock: string;
    probability: string;
    sort_num: number;
    status: string;
    created_at: string;
}

export default function LotteryPrizesPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const mediaLibrary = useMediaLibrary();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('lotteryPrizes');

    const [total, setTotal] = useState<number>(0);
    const [prizes, setPrizes] = useState<PrizeType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PrizeType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleAdd = () => {
        setEditingRecord(null);
        setImageUrl('');
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: PrizeType) => {
        setEditingRecord(record);
        setImageUrl(record.image || '');
        form.setFieldsValue({
            image: record.image,
            name: record.name,
            type: record.type,
            points: record.points,
            stock: record.stock,
            probability: record.probability,
            sort_num: record.sort_num,
        });
        setModalOpen(true);
    };

    const handleSelectImage = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                setImageUrl(url);
                form.setFieldValue('image', url);
            },
        });
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingRecord) {
                await apiPut(`/lottery/prizes/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/lottery/prizes', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchPrizes();
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
        setImageUrl('');
    };

    const columns: ColumnsType<PrizeType> = [
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
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <strong className={'text-gray-600'}>{name}</strong>
            ),
        },
        {
            title: t('type'),
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: string) => {
                const label = type === 'product' ? t('typeProduct') : t('typePoint');
                const color = type === 'product' ? 'blue' : 'orange';
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: t('points'),
            dataIndex: 'points',
            key: 'points',
            width: 100,
        },
        {
            title: t('stock'),
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
        },
        {
            title: t('probability'),
            dataIndex: 'probability',
            key: 'probability',
            width: 100,
        },
        {
            title: t('sortNum'),
            dataIndex: 'sort_num',
            key: 'sort_num',
            width: 80,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: number) => {
                const color = status === 1 ? 'success' : 'default';
                const label = status === 1 ? t('statusActive') : t('statusInactive');
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

    const fetchPrizes = () => {
        setLoading(true);
        apiGet('/lottery/prizes', {
            q: searchText,
            status: filterStatus === 'all' ? '' : filterStatus,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setPrizes([...items]);
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
            apiDelete(`/lottery/prizes/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchPrizes();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'activate') {
            setLoading(true);
            apiPut(`/lottery/prizes/batch`, {
                ids: selectedItems,
                data: {status: 1},
            }).then(() => {
                message.success(t('activateSuccess'));
                setSelectedItems([]);
                fetchPrizes();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'deactivate') {
            setLoading(true);
            apiPut(`/lottery/prizes/batch`, {
                ids: selectedItems,
                data: {status: 0},
            }).then(() => {
                message.success(t('deactivateSuccess'));
                setSelectedItems([]);
                fetchPrizes();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchPrizes();
    }, [offset, filterStatus]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('prizeManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchPrizes();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Select
                        defaultValue="all"
                        style={{width: 120}}
                        onChange={setFilterStatus}
                        options={[
                            {value: 'all', label: t('allStatus')},
                            {value: 'active', label: t('statusActive')},
                            {value: 'inactive', label: t('statusInactive')},
                        ]}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addPrize')}
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
                    dataSource={prizes}
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
                                    {value: 'activate', label: t('batchActivate')},
                                    {value: 'deactivate', label: t('batchDeactivate')},
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
                title={editingRecord ? t('editPrize') : t('addPrize')}
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
                    <Form.Item label={t('image')} name="image">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 12
                        }}>
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt="prize"
                                    width={60}
                                    height={60}
                                    style={{objectFit: 'contain', borderRadius: 4}}
                                    preview={false}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                                />
                            )}
                            <Button onClick={handleSelectImage}>{t('imagePlaceholder')}</Button>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={t('name')}
                        name="name"
                        rules={[{required: true, message: t('nameRequired')}]}
                    >
                        <Input placeholder={t('namePlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('type')} name="type">
                        <Select
                            placeholder={t('typePlaceholder')}
                            options={[
                                {value: 'product', label: t('typeProduct')},
                                {value: 'point', label: t('typePoint')},
                            ]}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item label={t('points')} name="points">
                        <Input placeholder={t('pointsPlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('stock')} name="stock">
                        <Input placeholder={t('stockPlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('probability')} name="probability">
                        <Input placeholder={t('probabilityPlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('sortNum')} name="sort_num">
                        <Input placeholder={t('sortNumPlaceholder')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
