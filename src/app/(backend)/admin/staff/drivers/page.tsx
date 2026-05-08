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
    Row,
    Col,
    Radio,
    Checkbox,
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
import {useMediaLibrary} from "@/contexts/BackendAppContext";
import type {Color} from 'antd/es/color-picker';

const {Search} = Input;

interface DriverType {
    id: number;
    avatar: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    pos_machines: string[];
    base_amount: string;
    color: string;
    created_at: string;
}

export default function DriversPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const mediaLibrary = useMediaLibrary();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('drivers');

    const [total, setTotal] = useState<number>(0);
    const [drivers, setDrivers] = useState<DriverType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DriverType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [posmachineOptions, setPosmachineOptions] = useState<any[]>([]);

    const handleAdd = () => {
        setEditingRecord(null);
        setAvatarUrl('');
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: DriverType) => {
        setEditingRecord(record);
        setAvatarUrl(record.avatar || '');
        form.setFieldsValue({
            avatar: record.avatar,
            name: record.name,
            phone: record.phone,
            email: record.email,
            status: record.status,
            pos_machines: record.pos_machines || [],
            base_amount: record.base_amount,
            color: record.color,
        });
        setModalOpen(true);
    };

    const handleSelectAvatar = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                setAvatarUrl(url);
                form.setFieldValue('avatar', url);
            },
        });
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Convert Color object to hex string
            if (values.color && typeof values.color === 'object') {
                values.color = (values.color as Color).toHexString();
            }

            if (editingRecord) {
                if (!values.password) {
                    delete values.password;
                }
                await apiPut(`/deliveryers/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/deliveryers', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchDrivers();
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
        setAvatarUrl('');
    };

    const columns: ColumnsType<DriverType> = [
        {
            title: t('avatar'),
            dataIndex: 'avatar',
            key: 'avatar',
            width: 70,
            render: (avatar: string) => (
                avatar ? (
                    <Image
                        src={avatar}
                        alt="avatar"
                        width={40}
                        height={40}
                        style={{objectFit: 'cover', borderRadius: '50%'}}
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
            title: t('phone'),
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                const color = status === 'online' ? 'success' : status === 'active' ? 'success' : 'default';
                const label = status === 'online' ? t('statusOnline') : status === 'offline' ? t('statusOffline') : status === 'active' ? t('statusActive') : t('statusInactive');
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: t('color'),
            dataIndex: 'color',
            key: 'color',
            width: 60,
            render: (color: string) => (
                color ? <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: color,
                    border: '1px solid #d9d9d9'
                }}/> : null
            ),
        },
        {
            title: t('baseAmount'),
            dataIndex: 'base_amount',
            key: 'base_amount',
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

    const fetchDrivers = () => {
        setLoading(true);
        apiGet('/deliveryers', {
            q: searchText,
            status: filterStatus === 'all' ? '' : filterStatus,
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setDrivers([...items]);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    const fetchMechines = () => {
        apiGet(`/pos-machines?status=idle&is_cashier=0`).then(response => {
            setPosmachineOptions(
                response.data.items.map((m: any) => ({
                    label: m.name,
                    value: m.id
                }))
            );
        })
    }

    const handleBatchAction = () => {
        if (!batchAction || selectedItems.length === 0) return;

        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete(`/deliveryers/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchDrivers();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'enable') {
            setLoading(true);
            apiPut(`/deliveryers/batch`, {
                ids: selectedItems,
                action: 'online',
            }).then(() => {
                message.success(t('enableSuccess'));
                setSelectedItems([]);
                fetchDrivers();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'disable') {
            setLoading(true);
            apiPut(`/deliveryers/batch`, {
                ids: selectedItems,
                action: 'offline',
            }).then(() => {
                message.success(t('disableSuccess'));
                setSelectedItems([]);
                fetchDrivers();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchDrivers();
    }, [offset, filterStatus]);

    React.useEffect(() => {
        fetchMechines();
    }, []);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('driverManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onSearch={(value) => {
                            setSearchText(value);
                            fetchDrivers();
                        }}
                        prefix={<SearchOutlined/>}
                    />
                    <Select
                        defaultValue="all"
                        style={{width: 120}}
                        onChange={setFilterStatus}
                        options={[
                            {value: 'all', label: t('allStatus')},
                            {value: 'online', label: t('statusOnline')},
                            {value: 'offline', label: t('statusOffline')},
                        ]}
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addDriver')}
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
                    dataSource={drivers}
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
                                    {value: 'enable', label: '上线'},
                                    {value: 'disable', label: '下线'},
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
                title={editingRecord ? t('editDriver') : t('addDriver')}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                okText={tc('save')}
                cancelText={tc('cancel')}
                destroyOnHidden
                width={640}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item label={t('avatar')} name="avatar">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 12
                        }}>
                            {avatarUrl && (
                                <Image
                                    src={avatarUrl}
                                    alt="avatar"
                                    width={60}
                                    height={60}
                                    style={{objectFit: 'cover', borderRadius: '50%'}}
                                    preview={false}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                                />
                            )}
                            <Button onClick={handleSelectAvatar}>{t('avatarPlaceholder')}</Button>
                        </div>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('name')}
                                name="name"
                                rules={[{required: true, message: t('nameRequired')}]}
                            >
                                <Input placeholder={t('namePlaceholder')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('phone')} name="phone">
                                <Input placeholder={t('phonePlaceholder')}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t('email')} name="email">
                                <Input placeholder={t('emailPlaceholder')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('password')} name="password">
                                <Input.Password placeholder={t('passwordPlaceholder')}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t('status')} name="status" initialValue="offline">
                                <Radio.Group>
                                    <Radio value="online">{t('statusOnline')}</Radio>
                                    <Radio value="offline">{t('statusOffline')}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('baseAmount')} name="base_amount">
                                <Input placeholder={t('baseAmountPlaceholder')}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={t('posMachines')} name="pos_machines">
                        <Checkbox.Group options={posmachineOptions}/>
                    </Form.Item>

                    <Form.Item label={t('color')} name="color">
                        <ColorPicker/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
