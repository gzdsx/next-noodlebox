'use client';

import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Modal, Radio, Row, Spin} from "antd";
import {DualAxes} from '@ant-design/plots';
import {apiGet, apiPost} from "@/lib/backendApi";
import dayjs from "dayjs";
import PaymentCheckboxGroup from "@/components/backend/PaymentCheckboxGroup";
import {useMessage} from "@/contexts/BackendAppContext";
import OrderDeletedHistory from "@/components/backend/OrderDeletedHistory";
import {useTranslations} from '@/contexts/BackendLocaleContext';

export default function FinanceStatisticsPage() {
    const message = useMessage();
    const {t} = useTranslations('financeStatistics');
    const {t: tc} = useTranslations('common');
    const [chartData, setChartData] = useState<any[]>([]);
    const [filterParams, setFilterParams] = useState({
        format: 'monthly',
        start_date: '',
        end_date: '',
    });
    const [deleteMethod, setDeleteMethod] = useState<'select' | 'percentage'>('select');
    const [submitting, setSubmitting] = useState(false);
    const [statistics, setStatistics] = useState<{
        total_sales: number,
        total_orders: number,
        shipping_fee: number,
        net_sales: number,
    }>({
        total_sales: 0,
        total_orders: 0,
        shipping_fee: 0,
        net_sales: 0,
    });
    const [showHistory, setShowHistory] = useState(false);

    const fetchChartData = () => {
        apiGet('/order/statistics', filterParams).then(res => {
            setChartData(
                res.data.labels.map((label: any, index: number) => ({
                    label: label,
                    [t('sales')]: Number(res.data.sales[index]),
                    [t('orderCount')]: Number(res.data.orders[index])
                }))
            );
            setStatistics(prevState => ({...prevState, ...res.data}));
        });
    }

    const chartConfig = {
        height: 400,
        xField: 'label',
        legend: true,
        children: [
            {
                data: chartData,
                type: 'line',
                yField: t('sales')
            },
            {
                data: chartData,
                type: 'line',
                yField: t('orderCount'),
                axis: {y: {position: 'right'}},
            }
        ]
    }

    const handleSubmit = (values: any) => {
        if (!values.date_range) {
            message.error(t('selectDateRange'));
            return false;
        }

        setSubmitting(true);
        apiPost('/finance/orders/adjust', {
            date_start: dayjs(values.date_range[0]).format('YYYY-MM-DD'),
            date_end: dayjs(values.date_range[1]).format('YYYY-MM-DD'),
            delete_method: values.delete_method,
            percentage: values.percentage || 50,
            payment_methods: values.payment_methods || [],
            created_types: values.created_types || [],
            exclude_payment_methods: values.exclude_payment_methods || [],
        }).then(() => {
            message.success(t('processComplete'));
            fetchChartData();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setSubmitting(false);
        });
    }

    useEffect(() => {
        fetchChartData();
    }, [filterParams]);

    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('statisticsManagement')}</h2>
            <Card>
                <div className={'flex flex-row justify-between items-center'}>
                    <div className={'font-bold'}>
                        {t('statisticsManagement')}(
                        {t('orderCount')}:
                        {statistics.total_orders} |
                        {t('totalSales')}:
                        {'€' + statistics.total_sales} |
                        {t('deliveryFee')}:
                        {'€' + statistics.shipping_fee} |
                        {t('actualSales')}:
                        {'€' + statistics.net_sales}
                        )
                    </div>
                    <div className={'flex items-center gap-x-1'}>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'weekly'
                            }))
                        }}>{t('byWeek')}</Button>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'monthly'
                            }))
                        }}>{t('byMonth')}</Button>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'yearly'
                            }))
                        }}>{t('byYear')}</Button>
                        <DatePicker.RangePicker
                            onChange={dates => {
                                if (dates) {
                                    setFilterParams(prevState => ({
                                        ...prevState,
                                        format: 'daily',
                                        start_date: dayjs(dates[0]).format('YYYY-MM-DD'),
                                        end_date: dayjs(dates[1]).format('YYYY-MM-DD')
                                    }));
                                } else {
                                    setFilterParams(prevState => ({
                                        ...prevState,
                                        format: 'monthly',
                                        start_date: '',
                                        end_date: ''
                                    }));
                                }
                            }}
                        />
                    </div>
                </div>
                <div>
                    <DualAxes {...chartConfig}/>
                </div>
            </Card>
            <div className={'h-4'}></div>
            <Card>
                <Form labelCol={{span: 2}} labelAlign={'left'} onFinish={handleSubmit}>
                    <Form.Item label={t('selectDate')} name={'date_range'}>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label={t('deleteMethod')} name={'delete_method'} initialValue={'select'}>
                        <Radio.Group
                            options={[
                                {
                                    label: t('deleteByCondition'),
                                    value: 'select'
                                },
                                {
                                    label: t('deleteByAmount'),
                                    value: 'percentage'
                                }
                            ]}
                            onChange={(e) => setDeleteMethod(e.target.value)}
                        />
                    </Form.Item>
                    {
                        deleteMethod === 'select' ? (
                            <>
                                <Form.Item label={t('orderMethod')} name={'created_types'}>
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
                                <Form.Item label={t('paymentMethod')} name={'payment_methods'}>
                                    <PaymentCheckboxGroup className={'gap-y-2'}/>
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item label={t('excludePaymentMethod')} name={'exclude_payment_methods'}>
                                    <PaymentCheckboxGroup className={'gap-y-2'}/>
                                </Form.Item>
                                <Form.Item label={t('adjustRatio')} name={'percentage'}>
                                    <Input suffix={'%'} className={'w-50!'}/>
                                </Form.Item>
                            </>
                        )
                    }
                    <Row>
                        <Col span={2}></Col>
                        <Col>
                            <Button type={'primary'} htmlType={'submit'}>{tc('confirm')}</Button>
                            <Button type={'link'} onClick={() => setShowHistory(true)}>{t('viewHistory')}</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {
                submitting && (
                    <Spin size={'large'} fullscreen={true} description={t('processing')}/>
                )
            }
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
                            fetchChartData();
                        }}/>
                    </Modal>
                )
            }
        </>
    );
}
