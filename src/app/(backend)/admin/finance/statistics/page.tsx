'use client';

import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Modal, Radio, Row, Spin} from "antd";
import {DualAxes} from '@ant-design/plots';
import {apiGet, apiPost} from "@/lib/backendApi";
import dayjs from "dayjs";
import PaymentCheckboxGroup from "@/components/backend/PaymentCheckboxGroup";
import {useMessage} from "@/contexts/BackendAppContext";
import OrderDeletedHistory from "@/components/backend/OrderDeletedHistory";

export default function FinanceStatisticsPage() {
    const message = useMessage();
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
                    '销售额': Number(res.data.sales[index]),
                    '订单数量': Number(res.data.orders[index])
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
                yField: '销售额'
            },
            {
                data: chartData,
                type: 'line',
                yField: '订单数量',
                axis: {y: {position: 'right'}},
            }
        ]
    }

    const handleSubmit = (values: any) => {
        if (!values.date_range) {
            message.error('请选择时间范围');
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
            message.success('订单已处理完成!');
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
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>数据统计</h2>
            <Card>
                <div className={'flex flex-row justify-between items-center'}>
                    <div className={'font-bold'}>
                        数据统计(
                        订单数量:
                        {statistics.total_orders} |
                        总销售额:
                        {'€' + statistics.total_sales} |
                        配送费:
                        {'€' + statistics.shipping_fee} |
                        实际销售额:
                        {'€' + statistics.net_sales}
                        )
                    </div>
                    <div className={'flex items-center gap-x-1'}>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'weekly'
                            }))
                        }}>按周</Button>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'monthly'
                            }))
                        }}>按月</Button>
                        <Button color={'default'} variant={'link'} size={'small'} onClick={() => {
                            setFilterParams(prevState => ({
                                ...prevState,
                                format: 'yearly'
                            }))
                        }}>按年</Button>
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
                    <Form.Item label={'选择日期'} name={'date_range'}>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label={'删除方式'} name={'delete_method'} initialValue={'select'}>
                        <Radio.Group
                            options={[
                                {
                                    label: '按条件删除',
                                    value: 'select'
                                },
                                {
                                    label: '按金额删除',
                                    value: 'percentage'
                                }
                            ]}
                            onChange={(e) => setDeleteMethod(e.target.value)}
                        />
                    </Form.Item>
                    {
                        deleteMethod === 'select' ? (
                            <>
                                <Form.Item label={'下单方式'} name={'created_types'}>
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
                                <Form.Item label={'付款方式'} name={'payment_methods'}>
                                    <PaymentCheckboxGroup className={'gap-y-2'}/>
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item label={'保留付款方式'} name={'exclude_payment_methods'}>
                                    <PaymentCheckboxGroup className={'gap-y-2'}/>
                                </Form.Item>
                                <Form.Item label={'调整比例'} name={'percentage'}>
                                    <Input suffix={'%'} className={'w-50!'}/>
                                </Form.Item>
                            </>
                        )
                    }
                    <Row>
                        <Col span={2}></Col>
                        <Col>
                            <Button type={'primary'} htmlType={'submit'}>确定</Button>
                            <Button type={'link'} onClick={() => setShowHistory(true)}>查看历史记录</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {
                submitting && (
                    <Spin size={'large'} fullscreen={true} description={'处理中...'}/>
                )
            }
            {
                showHistory && (
                    <Modal
                        title={'订单操作历史'}
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
