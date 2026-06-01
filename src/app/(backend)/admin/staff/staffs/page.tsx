'use client';

import React, {useState, useEffect} from 'react';
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
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    FileOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost, apiPut, apiDelete} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import {useMediaLibrary} from "@/contexts/BackendAppContext";
import ModalStaffSchedules from "@/app/(backend)/admin/staff/staffs/ModalStaffSchedules";
import ModelStaffInspection from "@/app/(backend)/admin/staff/staffs/ModelStaffInspection";

const {Search} = Input;

interface StaffType {
    id: number;
    avatar: string;
    name: string;
    phone_number: string;
    email: string;
    group_id: number;
    group_title: string;
    hourly_rate: string;
    pps_number: string;
    start_date: string;
    address: string;
    id_file_url: string;
    contract_file_url: string;
    status: string;
    created_at: string;
    group: {
        id: number;
        title: string;
    }
}

interface GroupOption {
    id: number;
    title: string;
}


export default function StaffsPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const mediaLibrary = useMediaLibrary();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('staffs');

    const [total, setTotal] = useState<number>(0);
    const [staffs, setStaffs] = useState<StaffType[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterGroup, setFilterGroup] = useState<number | undefined>(undefined);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<StaffType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    const [groups, setGroups] = useState<GroupOption[]>([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

    useEffect(() => {
        apiGet('/staff/groups', {limit: 100}).then(response => {
            setGroups(response.data.items || response.data || []);
        }).catch(() => {
        });
    }, []);

    const handleAdd = () => {
        setEditingRecord(null);
        setAvatarUrl('');
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: StaffType) => {
        setEditingRecord(record);
        setAvatarUrl(record.avatar || '');
        form.setFieldsValue({
            avatar: record.avatar,
            name: record.name,
            phone_number: record.phone_number,
            email: record.email,
            group_id: record.group_id,
            hourly_rate: record.hourly_rate,
            pps_number: record.pps_number,
            start_date: record.start_date,
            address: record.address,
            id_file_url: record.id_file_url,
            contract_file_url: record.contract_file_url,
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

    const handleSelectIdFile = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                form.setFieldValue('id_file_url', url);
            },
        });
    };

    const handleSelectContractFile = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                form.setFieldValue('contract_file_url', url);
            },
        });
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingRecord) {
                if (!values.password) {
                    delete values.password;
                }
                await apiPut(`/staff/staffs/${editingRecord.id}`, values);
                message.success(t('updateSuccess'));
            } else {
                await apiPost('/staff/staffs', values);
                message.success(t('createSuccess'));
            }
            setModalOpen(false);
            fetchStaffs();
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

    const columns: ColumnsType<StaffType> = [
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
            title: t('phoneNumber'),
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: 200,
        },
        {
            title: t('email'),
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
        },
        {
            title: t('groupId'),
            dataIndex: 'group_title',
            key: 'group_title',
            width: 120,
            render: (group_title: string, record) => (
                <strong className={'text-gray-600'}>{record.group?.title}</strong>
            ),
        },
        {
            title: t('hourlyRate'),
            dataIndex: 'hourly_rate',
            key: 'hourly_rate',
            width: 100,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                const color = status === 'active' ? 'success' : 'default';
                const label = status === 'active' ? t('statusActive') : t('statusInactive');
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: tc('actions'),
            key: 'action',
            align: 'end',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        variant="link"
                        color={'primary'}
                        size="small"
                        icon={<EditOutlined/>}
                        onClick={() => handleEdit(record)}
                        className={'px-0!'}
                    >
                        {tc('edit')}
                    </Button>
                    <Button
                        variant="link"
                        color={'primary'}
                        size="small"
                        icon={<FieldTimeOutlined/>}
                        className={'px-0!'}
                        onClick={() => {
                            setEditingRecord(record);
                            setIsScheduleModalOpen(true);
                        }}
                    >
                        {'Schedules'}
                    </Button>
                    <Button
                        variant="link"
                        color={'primary'}
                        size="small"
                        icon={<FileOutlined/>}
                        className={'px-0!'}
                        onClick={() => {
                            setEditingRecord(record);
                            setIsInspectionModalOpen(true);
                        }}
                    >
                        {'Inspection'}
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchStaffs = () => {
        setLoading(true);
        apiGet('/staff/staffs', {
            q: searchText,
            status: filterStatus === 'all' ? '' : filterStatus,
            group_id: filterGroup || '',
            offset,
            limit: 20,
        }).then(response => {
            const {items, total: t} = response.data;
            setTotal(t);
            setStaffs([...items]);
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
            apiDelete(`/staff/staffs/batch`, {ids: selectedItems as number[]}).then(() => {
                message.success(t('deleteSuccess'));
                setSelectedItems([]);
                fetchStaffs();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'enable') {
            setLoading(true);
            apiPut(`/staff/staffs/batch`, {
                ids: selectedItems,
                data: {status: 'active'},
            }).then(() => {
                message.success(t('enableSuccess'));
                setSelectedItems([]);
                fetchStaffs();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }

        if (batchAction === 'disable') {
            setLoading(true);
            apiPut(`/staff/staffs/batch`, {
                ids: selectedItems,
                data: {status: 'inactive'},
            }).then(() => {
                message.success(t('disableSuccess'));
                setSelectedItems([]);
                fetchStaffs();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    React.useEffect(() => {
        fetchStaffs();
    }, [offset, filterStatus, filterGroup]);

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('staffManagement')}</h2>
            <Card>
                <div style={{marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    <Search
                        placeholder={t('searchPlaceholder')}
                        allowClear
                        style={{width: 250}}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={fetchStaffs}
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
                    <Select
                        style={{width: 150}}
                        placeholder={t('groupId')}
                        value={filterGroup}
                        onChange={(value) => setFilterGroup(value)}
                        options={[{value: undefined, label: t('allGroups')}, ...groups.map(g => ({
                            value: g.id,
                            label: g.title
                        }))]}
                        allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                        {t('addStaff')}
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
                    dataSource={staffs}
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
                title={editingRecord ? t('editStaff') : t('addStaff')}
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
                            <Form.Item label={t('phoneNumber')} name="phone_number">
                                <Input placeholder={t('phoneNumberPlaceholder')}/>
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
                            <Form.Item label={t('groupId')} name="group_id">
                                <Select
                                    placeholder={t('groupIdPlaceholder')}
                                    options={groups.map(g => ({value: g.id, label: g.title}))}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('hourlyRate')} name="hourly_rate">
                                <Input placeholder={t('hourlyRatePlaceholder')}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t('ppsNumber')} name="pps_number">
                                <Input placeholder={t('ppsNumberPlaceholder')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('startDate')}
                                name="start_date"
                                help={t('startDateTips')}
                            >
                                <Input placeholder={t('startDatePlaceholder')}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={t('address')} name="address">
                        <Input placeholder={t('addressPlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('idFileUrl')} name="id_file_url">
                        <Input.Search
                            placeholder={t('idFileUrlPlaceholder')}
                            enterButton={t('selectFile')}
                            onSearch={handleSelectIdFile}
                        />
                    </Form.Item>

                    <Form.Item label={t('contractFileUrl')} name="contract_file_url">
                        <Input.Search
                            placeholder={t('contractFileUrlPlaceholder')}
                            enterButton={t('selectFile')}
                            onSearch={handleSelectContractFile}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {
                isScheduleModalOpen && (
                    <ModalStaffSchedules staff={editingRecord} onClose={() => setIsScheduleModalOpen(false)}/>
                )
            }
            {
                isInspectionModalOpen && (
                    <ModelStaffInspection staff={editingRecord} onClose={() => setIsInspectionModalOpen(false)}/>
                )
            }
        </div>
    );
}
