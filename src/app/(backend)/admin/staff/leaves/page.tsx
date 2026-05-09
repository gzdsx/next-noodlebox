'use client';

import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, Descriptions, DatePicker, Modal, Pagination, Select, Table, Form} from "antd";
import {apiDelete, apiGet, apiPut} from "@/lib/backendApi";
import type {ColumnsType} from "antd/es/table";
import {useMessage} from "@/contexts/BackendAppContext";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;

export default function Page() {
    const message = useMessage();
    const [total, setTotal] = useState<number>(0);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leave, setLeave] = useState<any>({});

    const fetchLeaves = () => {
        setLoading(true);
        apiGet(`/staff/leaves`, {
            offset,
            limit: 20,
        }).then(response => {
            setLeaves(response.data.items);
            setTotal(response.data.total);
        }).catch(reason => {

        }).finally(() => {
            setLoading(false);
        });
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Staff',
            dataIndex: 'staff',
            key: 'staff',
            render: (text, record) => {
                return <>{record.staff.name}</>
            }
        },
        {
            title: 'Start',
            dataIndex: 'start_date',
            key: 'start_date'
        },
        {
            title: 'End',
            dataIndex: 'end_date',
            key: 'end_date'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'CreatedAt',
            dataIndex: 'created_at',
            key: 'created_at'
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            align: 'end',
            width: 100,
            render: (text, record) => (
                <Button
                    className={'px-0!'}
                    type={'link'}
                    onClick={() => {
                        setLeave(record);
                        setIsModalOpen(true);
                    }}>审批</Button>
            )
        }
    ];

    const leaveDateRange = useMemo(() => {
        if (leave.start_date && leave.end_date) {
            return [
                dayjs(leave.start_date, 'YYYY-MM-DD'),
                dayjs(leave.end_date, 'YYYY-MM-DD')
            ] as any;
        }
        return [];
    }, [leave]);

    const handleSaveLeave = () => {
        setLoading(true);
        apiPut(`/staff/leaves/${leave.id}`, leave).then(() => {
            message.success('审批成功');
            setIsModalOpen(false);
            fetchLeaves();
        }).catch(reason => {
            message.error(reason.message || '保存失败');
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleBatchAction = () => {
        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete('/staff/leaves/batch', {ids: selectedItems as number[]}).then(() => {
                message.success('删除成功');
                setSelectedItems([]);
                fetchLeaves();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        fetchLeaves();
    }, [offset]);

    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>请假审批</h2>
            <Card>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    columns={columns}
                    dataSource={leaves}
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
                            {label: '批量操作', value: ''},
                            {label: '批量删除', value: 'delete'},
                        ]}
                    />
                    <Button type="primary" disabled={selectedItems.length === 0}
                            onClick={handleBatchAction}>应用</Button>
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
                title={'请假审批'}
                open={isModalOpen}
                onOk={handleSaveLeave}
                onCancel={() => setIsModalOpen(false)}
            >
                <Descriptions
                    column={1}
                    style={{marginBottom: 16}}
                    styles={{
                        label: {width: 100, color: '#666'}
                    }}
                    items={[
                        {
                            key: 'staff',
                            label: 'Staff',
                            children: leave.staff?.name
                        },
                        {
                            key: 'type',
                            label: 'Type',
                            children: leave.type
                        },
                        {
                            key: 'reason',
                            label: 'Reason',
                            children: leave.reason
                        }
                    ]}
                />
                <Form.Item label={'Date Range'} labelCol={{span: 5}}>
                    <RangePicker
                        defaultValue={leaveDateRange}
                        onChange={(value) => {
                            if (value) {
                                setLeave({
                                    ...leave,
                                    start_date: value?.[0]?.format('YYYY-MM-DD'),
                                    end_date: value?.[1]?.format('YYYY-MM-DD')
                                })
                            } else {
                                setLeave({
                                    ...leave,
                                    start_date: '',
                                    end_date: ''
                                })
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item label={'Status'} labelCol={{span: 5}}>
                    <Select
                        className={'w-40!'}
                        value={leave.status}
                        onChange={(value) => {
                            setLeave({
                                ...leave,
                                status: value
                            })
                        }}
                        options={[
                            {label: '待审批', value: 'pending'},
                            {label: '已批准', value: 'approved'},
                            {label: '已拒绝', value: 'rejected'},
                        ]}
                    />
                </Form.Item>
            </Modal>
        </>
    )
}