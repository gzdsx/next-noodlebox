'use client';

import React, {useEffect, useState} from "react";
import {Button, Card, Form, Input, Modal, Pagination, Select, Space, Table} from "antd";
import {apiDelete, apiGet, apiPost} from "@/lib/backendApi";
import type {ColumnsType} from "antd/es/table";
import StaffSelect from "@/components/backend/StaffSelect";
import {useMediaLibrary, useMessage} from "@/contexts/BackendAppContext";
import {useTranslations} from "@/contexts/BackendLocaleContext";

export default function Page() {
    const {t} = useTranslations('staffPayslips');
    const {t: tc} = useTranslations('common');
    const message = useMessage();
    const mediaLibrary = useMediaLibrary();
    const [total, setTotal] = useState<number>(0);
    const [payslips, setPayslips] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [payslipData, setPayslipData] = useState<{
        staff_id: number;
        date: string;
        file_url?: string;
    }>({
        staff_id: 0,
        date: '',
        file_url: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterParams, setFilterParams] = useState<Record<string, string>>({});

    const fetchPayslips = () => {
        setLoading(true);
        apiGet(`/staff/payslips`, {
            ...filterParams,
            offset,
            limit: 20,
        }).then(response => {
            setPayslips(response.data.items);
        }).catch(reason => {

        }).finally(() => {
            setLoading(false);
        });
    }

    const columns: ColumnsType<any> = [
        {
            title: t('staff'),
            dataIndex: 'staff',
            key: 'staff',
            render: (text, record) => {
                return <>{record.staff.name}</>
            }
        },
        {
            title: t('weekStart'),
            dataIndex: 'week_start',
            key: 'week_start'
        },
        {
            title: t('workingHours'),
            dataIndex: 'working_hours',
            key: 'working_hours'
        },
        {
            title: t('estGrossPay'),
            dataIndex: 'gross_pay',
            key: 'gross_pay'
        },
        {
            title: tc('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at'
        },
        {
            title: tc('actions'),
            dataIndex: 'options',
            key: 'options',
            align: 'end',
            width: 100,
            render: (text, record) => {
                return <a href={record.file_url} target={'_blank'}>View</a>
            }
        }
    ];

    const handleSavePayslip = () => {
        setLoading(true);
        apiPost(`/staff/payslips`, payslipData).then(() => {
            message.success(tc('saveSuccess'));
            setIsModalOpen(false);
            fetchPayslips();
        }).catch(reason => {
            message.error(reason.message || tc('saveError'));
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSearch = () => {
        if (offset == 0) {
            fetchPayslips();
        } else {
            setOffset(0);
        }
    }

    const handleBatchAction = () => {
        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete('/staff/payslips/batch', {ids: selectedItems as number[]}).then(() => {
                message.success(tc('deleteSuccess'));
                setSelectedItems([]);
                fetchPayslips();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        fetchPayslips();
    }, [offset]);

    return (
        <>
            <div className={'flex flex-row justify-between items-center mb-4'}>
                <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('payslipManagement')}</h2>
                <Button type={'primary'} onClick={() => setIsModalOpen(true)}>{t('uploadPayslips')}</Button>
            </div>
            <Card>
                <div className={'flex flex-row gap-x-4 mb-4'}>
                    <Form.Item label={t('staff')} layout={'horizontal'}>
                        <StaffSelect
                            allowClear={true}
                            className={'w-50!'}
                            onChange={value => {
                                setFilterParams((prev) => ({...prev, staff_id: value || ''}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('week')} layout={'horizontal'}>
                        <Input
                            type={'week'}
                            className={'w-50!'}
                            onChange={e => {
                                setFilterParams((prev) => ({...prev, date: e.target.value}));
                            }}
                        />
                    </Form.Item>
                    <Button type={'primary'} onClick={handleSearch}>{tc('search')}</Button>
                </div>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    columns={columns}
                    dataSource={payslips}
                    rowKey={record => record.id}
                    loading={loading}
                    pagination={false}
                />
            </Card>
            <div className="flex justify-between items-center mt-4">
                <div className="grow flex flex-row gap-x-4">
                    <Select
                        className="w-40"
                        defaultValue=""
                        onChange={(value) => setBatchAction(value)}
                        options={[
                            {label: tc('batchAction'), value: ''},
                            {label: tc('batchDelete'), value: 'delete'},
                        ]}
                    />
                    <Button type="primary" disabled={selectedItems.length === 0}
                            onClick={handleBatchAction}>{tc('apply')}</Button>
                </div>
                <Pagination
                    total={total}
                    pageSize={20}
                    showSizeChanger={false}
                    onChange={(page, pageSize) => {
                        setOffset((page - 1) * pageSize);
                    }}
                />
            </div>
            <Modal
                title={t('uploadPayslips')}
                open={isModalOpen}
                onOk={handleSavePayslip}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form layout={'vertical'}>
                    <Form.Item label={t('staff')}>
                        <StaffSelect
                            value={payslipData.staff_id}
                            onChange={value => {
                                setPayslipData(prev => ({...prev, staff_id: value}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('week')}>
                        <Input
                            type={'week'}
                            value={payslipData.date}
                            onChange={e => {
                                setPayslipData(prev => ({...prev, date: e.target.value}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('payslipFile')}>
                        <Space.Compact className={'w-full'}>
                            <Input
                                value={payslipData.file_url}
                                onChange={e => {
                                    setPayslipData(prev => ({...prev, file_url: e.target.value}));
                                }}
                            />
                            <Button onClick={() => {
                                mediaLibrary.open({
                                    onSelect: (files) => {
                                        setPayslipData(prev => ({...prev, file_url: files[0].src}));
                                    }
                                })
                            }}>{t('chooseFile')}</Button>
                        </Space.Compact>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}