'use client';

import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, Space, Spin, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {
    CloudUploadOutlined,
    DeleteOutlined,
    DownloadOutlined,
    ReloadOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import {apiGet, apiPost} from "@/lib/backendApi";
import {useMessage, useModal} from "@/contexts/BackendAppContext";
import {useTranslations} from "@/contexts/BackendLocaleContext";

function formatSize(bytes: number) {
    if (bytes === null || bytes === undefined) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
}

export default function Page() {
    const {t} = useTranslations('dataBackupPage');
    const {t: tc} = useTranslations('common');
    const message = useMessage();
    const modal = useModal();
    const [backups, setBackups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [backingUp, setBackingUp] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const fetchBackups = useCallback(() => {
        apiGet('/database/histories').then(response => {
            const data = response?.data;
            setBackups(Array.isArray(data) ? data : (data?.items || []));
        }).catch(reason => {
            message.error(reason.message || tc('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    }, [message, tc]);

    useEffect(() => {
        fetchBackups();
    }, []);

    const handleBackup = () => {
        setBackingUp(true);
        apiPost('/database/backup').then(() => {
            message.success(t('backupSuccess'));
            fetchBackups();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setBackingUp(false);
        });
    }

    const handleRestore = (record: any) => {
        modal.confirm({
            title: t('restoreConfirmTitle'),
            content: t('restoreConfirmContent'),
            okButtonProps: {danger: true},
            okText: tc('confirm'),
            cancelText: tc('cancel'),
            onOk: () => {
                setRestoring(true);
                apiPost(`/database/restore`, {file: record.name}).then(() => {
                    message.success(t('restoreSuccess'));
                }).catch(reason => {
                    message.error(reason.message);
                }).finally(() => {
                    setRestoring(false);
                });
            }
        });
    }

    const handleDelete = (record: any) => {
        modal.confirm({
            title: tc('deleteConfirm'),
            content: t('deleteBackupConfirm'),
            okButtonProps: {danger: true},
            okText: tc('confirm'),
            cancelText: tc('cancel'),
            onOk: () => {
                apiPost(`/database/delete-backup`, {file: record.name}).then(() => {
                    message.success(tc('deleteSuccess'));
                    fetchBackups();
                }).catch(reason => {
                    message.error(reason.message);
                });
            }
        });
    }

    const handleDownload = (record: any) => {
        window.open(record.url);
    }

    const columns: ColumnsType<any> = [
        {
            title: t('fileName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('fileSize'),
            dataIndex: 'size',
            key: 'size',
            width: 120,
            render: (size: number) => formatSize(size)
        },
        {
            title: tc('createdAt'),
            dataIndex: 'time',
            key: 'created_at',
            width: 180,
        },
        {
            title: tc('actions'),
            key: 'actions',
            align: 'end',
            width: 280,
            render: (_, record) => (
                <Space>
                    <Button
                        size={'small'}
                        icon={<DownloadOutlined/>}
                        loading={downloadingId === record.id}
                        onClick={() => handleDownload(record)}
                    >{t('download')}</Button>
                    <Button
                        size={'small'}
                        icon={<RollbackOutlined/>}
                        onClick={() => handleRestore(record)}
                    >{t('restore')}</Button>
                    <Button
                        size={'small'}
                        danger
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record)}
                    >{tc('delete')}</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('backupManagement')}</h2>
            <Card>
                <div className={'mb-4 flex items-center justify-between'}>
                    <div className={'text-base font-medium'}>{t('backupHistory')}</div>
                    <Space>
                        <Button icon={<ReloadOutlined/>} onClick={fetchBackups}>{t('refresh')}</Button>
                        <Button
                            type={'primary'}
                            icon={<CloudUploadOutlined/>}
                            loading={backingUp}
                            onClick={handleBackup}
                        >
                            {t('backupNow')}
                        </Button>
                    </Space>
                </div>
                <Table
                    rowKey={'name'}
                    columns={columns}
                    dataSource={backups}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showTotal: total => tc('totalRecords', {total}),
                    }}
                />
            </Card>
            {
                (backingUp || restoring) && (
                    <Spin
                        size={'large'}
                        fullscreen={true}
                        description={backingUp ? t('backingUp') : t('restoring')}
                    />
                )
            }
        </>
    );
}
