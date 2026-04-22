'use client';

import React, {useState} from 'react';
import {Layout, Menu, theme, Avatar, Dropdown, Button, Badge} from 'antd';
import type {MenuProps} from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    CommentOutlined,
    SettingOutlined,
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    SafetyOutlined,
    FileTextOutlined,
    ToolOutlined, MailOutlined, ReadOutlined, FormOutlined, UnorderedListOutlined,
    ShoppingCartOutlined, ShoppingOutlined, AppstoreOutlined, EnvironmentOutlined, SwapOutlined,
    FolderOutlined, PictureOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {signOut, useSession} from "next-auth/react";
import {apiPost} from "@/lib/api";
import {useTranslations} from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/backend/LanguageSwitcher';

const {Header, Sider, Content} = Layout;

export default function AdminLayoutClient({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const { t } = useTranslations('admin');

    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {data:session} = useSession();
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const menuItems: MenuProps['items'] = [
        {
            key: '/admin',
            icon: <DashboardOutlined/>,
            label: <Link href="/admin">{t('dashboard')}</Link>,
        },
        {
            key: 'shop',
            icon: <ShoppingCartOutlined/>,
            label: t('ecomManagement'),
            children: [
                {
                    key: '/admin/products',
                    icon: <ShoppingOutlined/>,
                    label: <Link href="/admin/products">{t('allProducts')}</Link>,
                },
                {
                    key: '/admin/products/create',
                    icon: <FormOutlined/>,
                    label: <Link href="/admin/products/create">{t('addProduct')}</Link>,
                },
                {
                    key: '/admin/orders',
                    icon: <UnorderedListOutlined/>,
                    label: <Link href="/admin/orders">{t('orderManagement')}</Link>,
                },
                {
                    key: '/admin/categories',
                    icon: <AppstoreOutlined/>,
                    label: <Link href="/admin/categories?taxonomy=product_category">{t('productCategoryManagement')}</Link>,
                },
                {
                    key: '/admin/products/variants',
                    icon: <SwapOutlined/>,
                    label: <Link href="/admin/products/variants">{t('productVariantManagement')}</Link>,
                },
                {
                    key: '/admin/shops',
                    icon: <EnvironmentOutlined/>,
                    label: <Link href="/admin/shops">{t('storeManagement')}</Link>,
                },
            ],
        },
        {
            key: 'posts',
            icon: <ReadOutlined/>,
            label: t('postManagement'),
            children: [
                {
                    key: '/admin/posts',
                    icon: <UnorderedListOutlined/>,
                    label: <Link href="/admin/posts">{t('allPosts')}</Link>,
                },
                {
                    key: '/admin/posts/create',
                    icon: <FormOutlined/>,
                    label: <Link href="/admin/posts/create">{t('addPost')}</Link>,
                },
                {
                    key: '/admin/categories?taxonomy=category',
                    icon: <AppstoreOutlined/>,
                    label: <Link href="/admin/categories?taxonomy=category">{t('postCategoryManagement')}</Link>,
                },
            ],
        },
        {
            key: 'pages',
            icon: <FileTextOutlined/>,
            label: t('pageManagement'),
            children: [
                {
                    key: '/admin/pages',
                    icon: <FileTextOutlined/>,
                    label: <Link href="/admin/pages">{t('allPages')}</Link>,
                },
                {
                    key: '/admin/pages/create',
                    icon: <FileTextOutlined/>,
                    label: <Link href="/admin/pages/create">{t('addPage')}</Link>,
                },
            ],
        },
        {
            key: 'user',
            icon: <TeamOutlined/>,
            label: t('userCenter'),
            children: [
                {
                    key: '/admin/users',
                    icon: <UserOutlined/>,
                    label: <Link href="/admin/users">{t('userManagement')}</Link>,
                },
                {
                    key: '/admin/roles',
                    icon: <SafetyOutlined/>,
                    label: <Link href="/admin/roles">{t('roleManagement')}</Link>,
                },
                {
                    key: '/admin/comments',
                    icon: <CommentOutlined/>,
                    label: <Link href="/admin/comments">{t('commentManagement')}</Link>,
                },
            ],
        },
        // {
        //     key: 'analytics',
        //     icon: <LineChartOutlined/>,
        //     label: t('dataAnalysis'),
        //     children: [
        //         {
        //             key: '/admin/analytics',
        //             icon: <BarChartOutlined/>,
        //             label: <Link href="/admin/analytics">{t('statistics')}</Link>,
        //         },
        //         {
        //             key: '/admin/reports',
        //             icon: <PieChartOutlined/>,
        //             label: <Link href="/admin/reports">{t('reports')}</Link>,
        //         },
        //     ],
        // },
        {
            key: 'system',
            icon: <SettingOutlined/>,
            label: t('systemManagement'),
            children: [
                {
                    key: '/admin/settings/general',
                    icon: <ToolOutlined/>,
                    label: <Link href="/admin/settings/general">{t('systemSettings')}</Link>,
                },
                {
                    key: '/admin/settings/mail',
                    icon: <MailOutlined/>,
                    label: <Link href="/admin/settings/mail">{t('mailSettings')}</Link>,
                }
            ],
        },
        {
            key: 'other',
            icon: <FolderOutlined/>,
            label: t('otherManagement'),
            children: [
                {
                    key: '/admin/materials',
                    icon: <AppstoreOutlined/>,
                    label: <Link href="/admin/materials">{t('materialManagement')}</Link>,
                },
                {
                    key: '/admin/swipers',
                    icon: <PictureOutlined/>,
                    label: <Link href="/admin/swipers">{t('swiperManagement')}</Link>,
                },
            ],
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            label: t('profile'),
        },
        {
            key: 'settings',
            label: t('accountSettings'),
            onClick: () => {
                router.push('/admin/profile');
            }
        },
        {
            key: 'signout',
            label: t('logout'),
            onClick: async () => {
                await apiPost('/auth/logout');
                await signOut({redirectTo: window.location.pathname});
            }
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'back',
            icon: <LogoutOutlined/>,
            label: <Link href="/">{t('backToFrontend')}</Link>,
        },
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: colorBgContainer,
                    borderRight: '1px solid #f0f0f0',
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <ShoppingOutlined style={{fontSize: 28, color: '#ff4d4f'}} />
                    {!collapsed && (
                        <span style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 8,
                            color: '#262626',
                        }}>
              XXShop
            </span>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    defaultOpenKeys={[]}
                    style={{borderRight: 0}}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px 0 0',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                        <LanguageSwitcher />
                        <Badge count={5} size="small">
                            <Button type="text" icon={<BellOutlined/>}/>
                        </Badge>
                        <Dropdown menu={{items: userMenuItems}} placement="bottomRight">
                            <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}>
                                <Avatar icon={<UserOutlined/>} src={session?.user?.image}/>
                                <span style={{color: '#262626'}}>{session?.user?.name}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: 16,
                        padding: 16,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
