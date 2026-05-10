'use client';

import React, {useState} from "react";
import {apiGet, apiPost} from "@/lib/backendApi";
import {useMessage, useModal} from "@/contexts/BackendAppContext";
import {Button, Card, Checkbox, DatePicker, Form, Modal, Spin} from "antd";
import dayjs from "dayjs";
import OrderDeletedHistory from "@/components/backend/OrderDeletedHistory";
import {useTranslations} from '@/contexts/BackendLocaleContext';

export default function Page() {
    const message = useMessage();
    const modal = useModal();
    const {t} = useTranslations('financeBills');
    const {t: tc} = useTranslations('common');
    const [bills, setBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterParams, setFilterParams] = useState<any>({
        date_range: [],
        created_vias: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const fetchBills = (values: any) => {
        if (!values.date_range) {
            message.error(t('selectDateRange'));
            return false;
        }

        const params = {
            date_range: [
                dayjs(values.date_range[0]).format('YYYY-MM-DD'),
                dayjs(values.date_range[1]).format('YYYY-MM-DD'),
            ],
            created_vias: values.created_vias || []
        }

        setFilterParams(params);
        setLoading(true);
        apiGet('/finance/bills', params).then(response => {
            setBills(
                response.data.items.map((item: any) => ({
                    ...item,
                    reserved_amount: '',
                    final_amount: item.total,
                    start_time: '',
                    end_time: ''
                }))
            )
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const preView = (bill: any) => {
        apiPost('/finance/bills/preview', {
            ...filterParams,
            ...bill
        }).then(response => {
            setBills(
                prevState => prevState.map((b) => {
                    if (b.payment_method === bill.payment_method) {
                        return {
                            ...b,
                            reserved_amount: response.data.total
                        }
                    }
                    return b;
                })
            )
        });
    }

    const handleSubmit = () => {
        modal.confirm({
            title: tc('deleteConfirm'),
            content: t('deleteSelectedConfirm'),
            onOk: () => {
                setSubmitting(true);
                apiPost('/finance/bills', {
                    ...filterParams,
                    bills: bills
                }).then(() => {
                    message.success(tc('deleteSuccess'));
                }).catch(reason => {
                    message.error(reason.message);
                }).finally(() => {
                    setSubmitting(false);
                })
            }
        })
    }

    const saleTotal = bills.reduce((a, b) => a + Number(b.total), 0);
    const finalTotal = bills.reduce((a, b) => a + Number(b.final_amount), 0);

    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('billManagement')}</h2>
            <Card>
                <Form layout={'vertical'} onFinish={fetchBills} onChange={event => {
                    console.log(event);
                }}>
                    <Form.Item label={t('selectDate')} name={'date_range'}>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label={t('orderMethod')} name={'created_vias'}>
                        <Checkbox.Group
                            options={[
                                {
                                    label: 'WEB',
                                    value: 'web'
                                },
                                {
                                    label: 'APP',
                                    value: 'app'
                                },
                                {
                                    label: 'POS',
                                    value: 'pos'
                                },
                                {
                                    label: 'AI',
                                    value: 'ai'
                                }
                            ]}
                        />
                    </Form.Item>
                    <Button type={'default'} htmlType={'submit'} loading={loading}>{t('query')}</Button>
                </Form>

                <table className={'w-full'}>
                    <thead>
                    <tr>
                        <th className={'text-left'}>{t('paymentMethod')}</th>
                        <th className={'text-left'}>{t('salesAmount')}</th>
                        <th className={'py-2 text-left leading-4'}>
                            <div>{t('deleteTimeRange')}</div>
                            <small className={'text-gray-400'}>{t('leaveEmptyForAll')}</small>
                        </th>
                        <th className={'text-left'}>{t('modifiedAmount')}</th>
                        <th className={'text-left'}>{t('finalAmount')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        bills.map((bill: any) => (
                            <tr key={bill.payment_method}>
                                <td>{bill.payment_method_title}</td>
                                <td>{'€' + bill.total}</td>
                                <td className={'py-2'}>
                                    <div>
                                        <input
                                            type="time"
                                            className={'border border-gray-300 rounded-sm py-1 px-2'}
                                            value={bill.start_time}
                                            onChange={e => {
                                                setBills(
                                                    prevState => prevState.map((b) => {
                                                        if (b.payment_method === bill.payment_method) {
                                                            return {
                                                                ...b,
                                                                start_time: e.target.value
                                                            }
                                                        }
                                                        return b;
                                                    })
                                                )
                                            }}
                                        />
                                        <span>-</span>
                                        <input
                                            type="time"
                                            className={'border border-gray-300 rounded-sm py-1 px-2'}
                                            value={bill.end_time}
                                            onChange={e => {
                                                setBills(
                                                    prevState => prevState.map((b) => {
                                                        if (b.payment_method === bill.payment_method) {
                                                            return {
                                                                ...b,
                                                                end_time: e.target.value
                                                            }
                                                        }
                                                        return b;
                                                    })
                                                )
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={'flex gap-x-2 items-center'}>
                                        <input
                                            type="number"
                                            className={'border border-gray-300 rounded-sm py-1 px-2'}
                                            value={bill.reserved_amount}
                                            onChange={e => {
                                                setBills(
                                                    prevState => prevState.map((b) => {
                                                        if (b.payment_method === bill.payment_method) {
                                                            return {
                                                                ...b,
                                                                reserved_amount: e.target.value
                                                            }
                                                        }
                                                        return b;
                                                    })
                                                )
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={'border border-gray-600 rounded-sm px-2 py-1'}
                                            onClick={() => preView(bill)}
                                        >{t('preDelete')}
                                        </button>
                                    </div>
                                </td>
                                <td>{'€' + bill.final_amount}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                    <tfoot>
                    <tr className={'border-t border-gray-600 font-bold'}>
                        <td className={'py-2'}>{t('totalSalesAmount')}</td>
                        <td>{'€' + saleTotal.toFixed(2)}</td>
                        <td></td>
                        <td>{t('totalFinalAmount')}</td>
                        <td>{'€' + finalTotal.toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </table>
                <div className={'mt-4'}>
                    <Button type={'primary'} onClick={handleSubmit}>{tc('confirm')}</Button>
                    <Button type={'link'} onClick={() => setShowHistory(true)}>{t('viewHistory')}</Button>
                </div>
            </Card>
            {
                showHistory && (
                    <Modal
                        title={t('orderHistory')}
                        open={true}
                        footer={null}
                        width={800}
                        onCancel={() => setShowHistory(false)}
                    >
                        <OrderDeletedHistory onRestored={() => {
                            setShowHistory(false);
                        }}/>
                    </Modal>
                )
            }
            {
                submitting && (
                    <Spin size={'large'} fullscreen={true} description={t('processing')}/>
                )
            }
        </>
    );
}
