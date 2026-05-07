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
    Radio,
    Tag,
    ColorPicker,
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

interface CommentColorType {
    id: number;
    color: string;
    name: string;
    enable: number;
    sort_num: string;
    created_at: string;
}

export default function CommentColorsPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('commentColors');

    const [total, setTotal] = useState<number>(0);
    const [colors, setColors] = useState<CommentColorType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<CommentColorType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: CommentColorType) => {
        setEditingRecord(record);
        form.setFieldsValue({
            color: record.color,
            name: record.name,
            enable: record.enable,
            sort_num: record.sort_num,
        });
        setModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.color && typeof values.color === 'object') {
                values.color = values.color.toHexString();
            }
            setSubmitting(true);
            if (editingRecord) {
                await apiPut(`/pos/comment/colors/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/pos/comment/colors', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchColors();
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

    const columns: ColumnsType<CommentColorType> = [
        {
            title: t('color'),
            dataIndex: 'color',
            key: 'color',
            width: 100,
            render: (color: string) => (
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        backgroundColor: color,
                        border: '1px solid #d9d9d9',
                    }}/>
                    <span>{color}</span>
                </div>
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
            title: t('enable'),
            dataIndex: 'enable',
            key: 'enable',
            width: 100,
            render: (enable: number) => (
                <Tag color={enable === 1 ? 'success' : 'default'}>
                    {enable === 1 ? t('enableYes') : t('enableNo')}
                </Tag>
            ),
        },
        {
            title: t('sortNumber'),
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

    const fetchColors = () => {
        setLoading(true);
        apiGet('/pos/comment/colors', {
            q: searchText,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setColors([...items]);
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
            apiDelete(`/pos/comment/colors/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchColors();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        } else if (batchAction === 'enable') {
            setLoading(true);
            apiPut(`/pos/comment/colors/batch`, {ids: selectedItems as number[], enable: 1}).then(() => {
                message.success(t('enableSuccess'));
                setSelectedItems([]);
                fetchColors();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        } else if (batchAction === 'disable') {
            setLoading(true);
            apiPut(`/pos/comment/colors/batch`, {ids: selectedItems as number[], enable: 0}).then(() => {
                message.success(t('disableSuccess'));
                setSelectedItems([]);
                fetchColors();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchColors();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('commentColorManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchColors();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addCommentColor')}
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
                    dataSource={colors}
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
                                    {value: 'enable', label: t('batchEnable')},
                                    {value: 'disable', label: t('batchDisable')},
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
                title={editingRecord ? t('editCommentColor') : t('addCommentColor')}
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
                        label={t('color')}
                        name="color"
                        rules={[{required: true, message: t('colorRequired')}]}
                    >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        label={t('name')}
                        name="name"
                        rules={[{required: true, message: t('nameRequired')}]}
                    >
                        <Input placeholder={t('namePlaceholder')}/>
                    </Form.Item>

                    <Form.Item
                        label={t('enable')}
                        name="enable"
                        rules={[{required: true, message: t('enableRequired')}]}
                    >
                        <Radio.Group>
                            <Radio value={1}>{t('enableYes')}</Radio>
                            <Radio value={0}>{t('enableNo')}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label={t('sortNumber')} name="sort_num">
                        <Input placeholder={t('sortNumberPlaceholder')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
