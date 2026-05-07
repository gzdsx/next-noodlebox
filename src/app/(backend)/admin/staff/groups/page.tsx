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

interface StaffGroupType {
    id: number;
    title: string;
    created_at: string;
}

export default function StaffGroupsPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('staffGroups');

    const [total, setTotal] = useState<number>(0);
    const [groups, setGroups] = useState<StaffGroupType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<StaffGroupType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: StaffGroupType) => {
        setEditingRecord(record);
        form.setFieldsValue({title: record.title});
        setModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingRecord) {
                await apiPut(`/staff/groups/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/staff/groups', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchGroups();
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

    const columns: ColumnsType<StaffGroupType> = [
        {
            title: t('title'),
            dataIndex: 'title',
            key: 'title',
            render: (title: string) => (
                <strong className={'text-gray-600'}>{title}</strong>
            ),
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

    const fetchGroups = () => {
        setLoading(true);
        apiGet('/staff/groups', {
            q: searchText,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setGroups([...items]);
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
            apiDelete(`/staff/groups/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchGroups();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchGroups();
    }, [offset]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('groupManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchGroups();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addGroup')}
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
                    dataSource={groups}
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
                title={editingRecord ? t('editGroup') : t('addGroup')}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                okText={tc('save')}
                cancelText={tc('cancel')}
                destroyOnHidden={true}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item
                        label={t('title')}
                        name="title"
                        rules={[{required: true, message: t('titleRequired')}]}
                    >
                        <Input placeholder={t('titlePlaceholder')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
