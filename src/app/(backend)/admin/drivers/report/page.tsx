'use client';

import React, {useState} from 'react';
import {
    Table,
    Card,
    App,
    Button,
    Space,
} from 'antd';
import {
    PrinterOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {apiGet} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import Link from "next/link";
import ModalDriverReport from "@/components/backend/ModalDriverReport";

interface DriverBillType {
    id: number;
    name: string;
    shipping_total: string;
    online_total: string;
    card_total: string;
    cash_total: string;
    cost_total: string;
    actual_total: string;
    report: {
        shipping_total: string;
        online_total: string;
        card_total: string;
        cash_total: string;
        cost_total: string;
        actual_total: string;
    };
    links?: {
        report?: {
            href?: string;
        };
    };
}

export default function DriverBillsPage() {
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('driverBills');

    const [bills, setBills] = useState<DriverBillType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<any>({});

    const handlePrint = (record: DriverBillType) => {
        window.open(record.links?.report?.href || `/admin/driver-bills/${record.id}/print`);
    };

    const columns: ColumnsType<DriverBillType> = [
        {
            title: t('driver'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record) => (
                <strong className={'text-gray-600 cursor-pointer'} onClick={() => {
                    setEditingDriver(record);
                    setIsReportModalOpen(true);
                }}>{name}</strong>
            ),
        },
        {
            title: t('shippingTotal'),
            key: 'shipping_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.shipping_total}</strong>
            ),
        },
        {
            title: t('onlineTotal'),
            key: 'online_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.online_total}</strong>
            ),
        },
        {
            title: t('cardTotal'),
            key: 'card_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.card_total}</strong>
            ),
        },
        {
            title: t('cashTotal'),
            key: 'cash_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.cash_total}</strong>
            ),
        },
        {
            title: t('costTotal'),
            key: 'cost_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.cost_total}</strong>
            ),
        },
        {
            title: t('actualTotal'),
            key: 'actual_total',
            render: (_: string, record) => (
                <strong className={'text-gray-600'}>{record.report.actual_total}</strong>
            ),
        },
        {
            title: tc('actions'),
            key: 'action',
            width: 100,
            align: 'end',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<PrinterOutlined/>}
                        onClick={() => handlePrint(record)}
                        className={'px-0!'}
                    >
                        {t('print')}
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchBills = () => {
        setLoading(true);
        apiGet('/deliveryer/transactions/reports').then(response => {
            setBills([...response.data]);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    React.useEffect(() => {
        fetchBills();
    }, []);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
                <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('driverRealtimeReport')}</h2>
                <Link href={'/admin/drivers/transactions'}>
                    <Button type="primary">{t('historyBills')}</Button>
                </Link>
            </div>
            <Card>
                <Table
                    dataSource={bills}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    rowKey={record => record.id}
                />
            </Card>
            {
                isReportModalOpen && (
                    <ModalDriverReport
                        driver={editingDriver}
                        onClose={() => setIsReportModalOpen(false)}
                        onSubmited={fetchBills}
                    />
                )
            }
        </div>
    );
}
