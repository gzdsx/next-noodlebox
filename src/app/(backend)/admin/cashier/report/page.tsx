'use client';

import React, {useMemo, useState} from 'react';
import {
    Card,
    Descriptions,
    App,
    Spin, Select, Input, Button,
} from 'antd';
import {apiGet, apiPost} from "@/lib/backendApi";
import {useTranslations} from '@/contexts/BackendLocaleContext';
import {SearchOutlined} from "@ant-design/icons";
import Link from "next/link";

interface CashierReportType {
    actual_balance: string;
    driver_pm: string;
    shipping_total: string;
    online_total: string;
    card_total: string;
    cash_total: string;
    cost_total: string;
    last_balance: string;
    refund_total: string;
    hand_on_total: string;
    total: string;
    netTotal: string;
    actual_total: string;
    pos_balance: string;
}

export default function CashierReportPage() {
    const {message} = App.useApp();
    const {t} = useTranslations('cashierReport');
    const {t: tc} = useTranslations('common');

    const [report, setReport] = useState<CashierReportType | null>(null);
    const [loading, setLoading] = useState(false);
    const [posBalance, setPosBalance] = useState('0');
    const [status, setStatus] = useState('settled');
    const [notes, setNotes] = useState('');

    const fetchReport = () => {
        setLoading(true);
        apiGet('/casher/transactions/report').then(response => {
            setReport(response.data);
            setPosBalance(response.data?.actual_balance || '0')
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        apiPost(`/casher/transactions`, {
            status: status,
            pos_balance: posBalance,
            notes: notes
        }).then(() => {
            message.success(t('submitSuccess'));
            fetchReport();
        }).catch(reason => {
            message.error(reason.message || t('submitError'));
        }).finally(() => {
            setLoading(false);
        });
    }

    const netTotal = useMemo(() => {
        if (!report) return '-';
        const {actual_total, actual_balance, driver_pm} = report
        return (Number(+actual_total) + Number(actual_balance) - Number(driver_pm) - Number(+posBalance))?.toFixed(2);
    }, [posBalance, report]);

    React.useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
                <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('cashierReport')}</h2>
                <Link href={'/admin/cashier/transactions'}>
                    <Button type="primary">{t('historyBills')}</Button>
                </Link>
            </div>
            <Card>
                <Spin spinning={loading}>
                    <Descriptions
                        bordered
                        column={6}
                        size="middle"
                        layout={'vertical'}
                    >
                        <Descriptions.Item label={t('float')}>
                            {report?.actual_balance ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('pm')}>
                            {report?.driver_pm ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('shippingTotal')}>
                            {report?.shipping_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('onlineTotal')}>
                            {report?.online_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('cardTotal')}>
                            {report?.card_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('cashTotal')}>
                            {report?.cash_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('costTotal')}>
                            {report?.cost_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('balance')}>
                            {report?.last_balance ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('refundTotal')}>
                            {report?.refund_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('handOnTotal')}>
                            {report?.hand_on_total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('total')}>
                            {report?.total ?? '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('netTotal')}>
                            {netTotal}
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                            <label>{t('status')}</label>
                            <Select
                                style={{width: 140}}
                                value={status}
                                onChange={setStatus}
                                options={[
                                    {value: 'settled', label: t('statusSettled')},
                                    {value: 'pending', label: t('statusPending')},
                                ]}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                            <label>{t('posBalance')}</label>
                            <Input
                                style={{width: 140}}
                                value={posBalance}
                                onChange={e => setPosBalance(e.target.value)}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                            <label>{t('notes')}</label>
                            <Input
                                style={{width: 280}}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                        <Button type="primary" onClick={handleSubmit}>
                            {tc('submit')}
                        </Button>
                    </div>
                </Spin>
            </Card>
        </div>
    );
}
