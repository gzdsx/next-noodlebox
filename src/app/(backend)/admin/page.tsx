'use client';

import React from 'react';
import {Card, Col, Row, Statistic, Table, Progress, Flex, Avatar, Tag} from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    DollarOutlined,
    RiseOutlined,
    ArrowUpOutlined,
    ShopOutlined,
    TeamOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import {useTranslations} from '@/contexts/BackendLocaleContext';

const {Column} = Table;

export default function AdminDashboard() {
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('dashboard');
    const {t: ta} = useTranslations('admin');

    const statsData = [
        {
            title: t('todaySales'),
            value: 128956,
            prefix: '¥',
            icon: <DollarOutlined style={{fontSize: 32, color: '#ff4d4f'}}/>,
        },
        {
            title: t('todayOrders'),
            value: 358,
            suffix: t('unitOrders'),
            icon: <ShoppingCartOutlined style={{fontSize: 32, color: '#1890ff'}}/>,
        },
        {
            title: t('todayVisitors'),
            value: 8549,
            suffix: t('unitPeople'),
            icon: <UserOutlined style={{fontSize: 32, color: '#52c41a'}}/>,
        },
        {
            title: t('conversionRate'),
            value: 4.2,
            suffix: '%',
            icon: <RiseOutlined style={{fontSize: 32, color: '#faad14'}}/>,
        },
    ];

    const recentOrdersData = [
        {key: '1', orderNo: 'ORD20260411001', customer: t('customer1'), amount: 2580.00, date: '2026-04-11', status: t('paid')},
        {key: '2', orderNo: 'ORD20260411002', customer: t('customer2'), amount: 1368.50, date: '2026-04-11', status: t('pendingShipment')},
        {key: '3', orderNo: 'ORD20260410003', customer: t('customer3'), amount: 4200.00, date: '2026-04-10', status: t('completed')},
        {key: '4', orderNo: 'ORD20260410004', customer: t('customer4'), amount: 899.00, date: '2026-04-10', status: t('paid')},
        {key: '5', orderNo: 'ORD20260410005', customer: t('customer5'), amount: 5640.00, date: '2026-04-10', status: t('pendingPayment')},
    ];

    const topProductsData = [
        {id: 1, title: 'iPhone 16 Pro Max', sales: 2340, revenue: 16380000},
        {id: 2, title: 'MacBook Air M4', sales: 1856, revenue: 14848000},
        {id: 3, title: 'AirPods Pro 3', sales: 3420, revenue: 5130000},
        {id: 4, title: 'iPad Pro M4', sales: 1290, revenue: 9030000},
        {id: 5, title: 'Apple Watch Ultra 3', sales: 980, revenue: 5880000},
    ];

    const categoryData = [
        {name: t('categoryDigital'), value: 38},
        {name: t('categoryClothing'), value: 24},
        {name: t('categoryHome'), value: 18},
        {name: t('categoryFood'), value: 12},
        {name: t('categoryBeauty'), value: 8},
    ];

    const statusColorMap: Record<string, string> = {
        [t('paid')]: 'success',
        [t('pendingShipment')]: 'processing',
        [t('completed')]: 'default',
        [t('pendingPayment')]: 'warning',
        [t('cancelled')]: 'error',
    };

    return (
        <div>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{ta('dashboard')}</h2>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div>
                                    <div style={{color: '#8c8c8c', fontSize: 14, marginBottom: 8}}>{stat.title}</div>
                                    <Statistic
                                        value={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        styles={{
                                            content: {
                                                fontSize: 28, fontWeight: 'bold'
                                            }
                                        }}
                                    />
                                </div>
                                {stat.icon}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Recent Orders & Top Products */}
            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                <Col xs={24} lg={14}>
                    <Card title={t('recentOrders')} extra={<a href="/admin/orders">{tc('more')}</a>}>
                        <Table dataSource={recentOrdersData} pagination={false} size="middle">
                            <Column title={t('orderNo')} dataIndex="orderNo" key="orderNo"/>
                            <Column title={t('customer')} dataIndex="customer" key="customer"/>
                            <Column
                                title={t('amount')}
                                dataIndex="amount"
                                key="amount"
                                render={(amount: number) => `¥${amount.toFixed(2)}`}
                            />
                            <Column title={t('date')} dataIndex="date" key="date"/>
                            <Column
                                title={t('status')}
                                dataIndex="status"
                                key="status"
                                render={(status: string) => (
                                    <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
                                )}
                            />
                        </Table>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title={t('hotProducts')}>
                        <Flex vertical gap={12}>
                            {topProductsData.map((item, index) => (
                                <div key={item.id}
                                     style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                        <Avatar
                                            size="small"
                                            style={{backgroundColor: index < 3 ? '#ff4d4f' : '#8c8c8c'}}
                                        >
                                            {index + 1}
                                        </Avatar>
                                        <div>
                                            <div style={{fontWeight: 500}}>{item.title}</div>
                                            <div style={{color: '#8c8c8c', fontSize: 12}}>{t('salesCount')} {item.sales.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div style={{fontWeight: 'bold', color: '#ff4d4f'}}>
                                        ¥{(item.revenue / 10000).toFixed(1)}{t('unitTenThousand')}
                                    </div>
                                </div>
                            ))}
                        </Flex>
                    </Card>
                </Col>
            </Row>

            {/* Category Distribution & Overview */}
            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                <Col xs={24} lg={12}>
                    <Card title={t('categorySalesRatio')}>
                        {categoryData.map((item, index) => (
                            <div key={index} style={{marginBottom: 16}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                                    <span>{item.name}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <Progress percent={item.value} strokeColor="#ff4d4f" showInfo={false}/>
                            </div>
                        ))}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={t('dataOverview')}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card style={{background: '#fff1f0', border: 'none'}}>
                                    <Statistic
                                        title={t('monthlySales')}
                                        value={328.5}
                                        prefix={<><ArrowUpOutlined style={{color: '#52c41a'}}/> ¥</>}
                                        suffix={t('unitTenThousand')}
                                        styles={{content: {color: '#262626'}}}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card style={{background: '#e6f7ff', border: 'none'}}>
                                    <Statistic
                                        title={t('monthlyNewUsers')}
                                        value={2456}
                                        prefix={<ArrowUpOutlined style={{color: '#52c41a'}}/>}
                                        styles={{content: {color: '#262626'}}}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card style={{background: '#f6ffed', border: 'none'}}>
                                    <Statistic
                                        title={t('storeCount')}
                                        value={12}
                                        prefix={<ShopOutlined style={{color: '#52c41a'}}/>}
                                        styles={{content: {color: '#262626'}}}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card style={{background: '#fffbe6', border: 'none'}}>
                                    <Statistic
                                        title={t('activeCustomers')}
                                        value={856}
                                        prefix={<TeamOutlined style={{color: '#faad14'}}/>}
                                        styles={{content: {color: '#262626'}}}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
