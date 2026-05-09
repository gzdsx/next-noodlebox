'use client';

import React, {useState, useEffect} from 'react';
import {Table, Button, Pagination, Spin} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {apiGet, apiPost} from "@/lib/backendApi";
import {useMessage, useModal} from "@/contexts/BackendAppContext";

interface HistoryItem {
    id: string;
    created_at: string;
    options: string;
}

const OrderDeletedHistory = ({onRestored}: { onRestored?: () => void }) => {
    const modal = useModal();
    const message = useMessage();
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiGet(`/finance/histories`, {
                offset,
                limit: 10
            });
            setData(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error('获取数据失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [offset]);

    const columns: ColumnsType<HistoryItem> = [
        {
            title: '操作时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '选项',
            dataIndex: 'options',
            key: 'options',
            width: '100',
            align: 'end',
            render: (text: string, record: HistoryItem) => (
                <Button
                    type="primary"
                    size={'small'}
                    onClick={() => {
                        modal.confirm({
                            title: '恢复确认',
                            content: '确定要恢复此次操作吗？',
                            onOk: () => {
                                setSubmiting(true);
                                apiPost('/finance/rollback', {
                                    id: record.id
                                }).then(() => {
                                    message.success('操作已完成');
                                    fetchData();
                                    onRestored?.();
                                }).catch(err => {

                                }).finally(() => {
                                    setSubmiting(false);
                                });
                            }
                        })
                    }}
                >
                    恢复
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
            <div className={'flex justify-end mt-4'}>
                <Pagination
                    total={total}
                    pageSize={20}
                    showSizeChanger={false}
                    onChange={(page, pageSize) => {
                        setOffset((page - 1) * pageSize);
                    }}
                />
            </div>
            {
                submiting && (
                    <Spin size={'large'} fullscreen={true} description={'恢复中...'}/>
                )
            }
        </div>
    );
};

export default OrderDeletedHistory;
