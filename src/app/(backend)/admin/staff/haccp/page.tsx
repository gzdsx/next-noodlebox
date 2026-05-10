'use client';

import React, {useEffect, useMemo, useState} from "react";
import {App, Button, Card, Checkbox, Col, DatePicker, Form, Input, Modal, Pagination, Row, Select, Table, Tag} from "antd";
import {apiDelete, apiGet, apiPost} from "@/lib/backendApi";
import type {ColumnsType} from "antd/es/table";
import StaffSelect from "@/components/backend/StaffSelect";
import {useMediaLibrary} from "@/contexts/BackendAppContext";
import ModalHaccpReport from "@/components/backend/ModalHaccpReport";
import SignatureCanvas from "@/components/common/SignatureCanvas";
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import RichTextEditor from "@/components/common/RichTextEditor";
import {useTranslations} from '@/contexts/BackendLocaleContext';

dayjs.extend(isoWeek);

const reportTypes = [
    {
        value: "delivery_record",
        label: "Transport & Delivery",
    },
    {
        value: "cooking_record",
        label: "Cooking/Cooling/Reheating",
    },
    {
        value: "cleaning_counter",
        label: "Cleaning - Counter",
    },
    {
        value: "cleaning_chefs",
        label: "Cleaning - Chefs",
    },
    {
        value: "cleaning_porters",
        label: "Cleaning - Porters",
    },
    {
        value: "temperature_record",
        label: "Unit Temperature Control",
    },
];

export default function Page() {
    const {message} = App.useApp();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('staffHaccp');

    const [total, setTotal] = useState<number>(0);
    const [reports, setReports] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<React.Key[]>([]);
    const [batchAction, setBatchAction] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterParams, setFilterParams] = useState<Record<string, string>>({
        date: dayjs().format("YYYY-[W]WW")
    });
    const [report, setReport] = useState<any>({});
    const [showSign, setShowSign] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [signatureData, setSignatureData] = useState<string>('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOptions, setPdfOptions] = useState<any>({});

    const fetchReports = () => {
        setLoading(true);
        apiGet(`/staff/haccp/reports`, {
            ...filterParams,
            offset,
            limit: 20,
        }).then(response => {
            setReports(response.data.items);
            setTotal(response.data.total);
        }).catch(reason => {
            message.error(reason.message || t('fetchError'));
        }).finally(() => {
            setLoading(false);
        });
    }

    const getSignStatus = () => {
        apiGet(`/staff/haccp/reviews`, {
            date: filterParams.date || '',
        }).then(response => {
            setIsSigned(response.data.items.length > 0);
        });
    }

    const getReportIntroduction = () => {
        apiGet(`/staff/haccp/reports/options`).then(response => {
            setPdfOptions({...response.data});
        });
    }

    const columns: ColumnsType<any> = [
        {
            title: t('type'),
            dataIndex: 'type_text',
            key: 'type_text',
            render: (text, record) => (
                <a className={'text-blue-500'} onClick={() => {
                    setReport(record);
                    setIsModalOpen(true);
                }}>{text}</a>
            )
        },
        {
            title: t('summary'),
            dataIndex: 'summary',
            key: 'summary'
        },
        {
            title: t('staff'),
            dataIndex: 'staff',
            key: 'staff',
            render: (text, record) => {
                return <>{record.staff?.name}</>
            }
        },
        {
            title: tc('createdAt'),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180
        }
    ];

    const recordTypeName = useMemo(() => {
        for (const item of reportTypes) {
            if (item.value === filterParams.type) {
                return item.label;
            }
        }
        return '';
    }, [filterParams.type]);

    const handlePdfFormSubmit = (values: any) => {
        console.log(values);
        setLoading(true);
        apiPost(`/staff/haccp/reports/export`, values).then((response) => {
            window.open(response.data.url);
        }).catch((reason) => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSaveSign = () => {
        apiPost(`/staff/haccp/reviews`, {
            date: filterParams.date,
            report_type: filterParams.type,
            signatureData: signatureData,
        }).then(() => {
            getSignStatus();
            message.success(t('signatureSuccess'));
            setIsSigned(true);
            setShowSign(false);
        }).catch(reason => {
            message.error(reason.message || t('signatureError'));
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSearch = () => {
        if (offset == 0) {
            fetchReports();
        } else {
            setOffset(0);
        }
        getSignStatus();
    }

    const handleBatchAction = () => {
        if (batchAction === 'delete') {
            setLoading(true);
            apiDelete('/staff/haccp/reports/batch', {ids: selectedItems as number[]}).then(() => {
                message.success(tc('deleteSuccess'));
                setSelectedItems([]);
                fetchReports();
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            fetchReports();
            getSignStatus();
        });
    }, [offset]);

    useEffect(() => {
        getReportIntroduction();
    }, []);

    return (
        <>
            <div className={'flex flex-row justify-between items-center mb-4'}>
                <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>{t('haccpManagement')}</h2>
                <div className={'flex flex-row gap-x-4'}>
                    <span>{t('signOffStatus')}</span>
                    <Tag color={isSigned ? 'green' : 'red'}>{isSigned ? t('signed') : t('unsigned')}</Tag>
                    <Button size={'small'} type={'primary'} onClick={() => setShowSign(true)}>{t('signOff')}</Button>
                </div>
            </div>
            <Card>
                <div className={'flex flex-row gap-x-4 mb-4'}>
                    <Form.Item label={t('week')} layout={'horizontal'}>
                        <Input
                            allowClear={true}
                            type={'week'}
                            value={filterParams.date}
                            className={'w-50!'}
                            onChange={e => {
                                setFilterParams((prev) => ({...prev, date: e.target.value}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('staff')} layout={'horizontal'}>
                        <StaffSelect
                            allowClear={true}
                            className={'w-50!'}
                            onChange={value => {
                                setFilterParams((prev) => ({...prev, staff_id: value || ''}));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('type')} layout={'horizontal'}>
                        <Select
                            className={'w-50!'}
                            allowClear={true}
                            onChange={value => {
                                setFilterParams((prev) => ({...prev, type: value || ''}));
                            }}
                            options={reportTypes}
                        />
                    </Form.Item>
                    <Button type={'primary'} onClick={handleSearch}>{tc('search')}</Button>
                </div>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedItems,
                        onChange: (selectedRowKeys) => {
                            setSelectedItems([...selectedRowKeys]);
                        },
                    }}
                    columns={columns}
                    dataSource={reports}
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
                            {label: tc('batchAction'), value: ''},
                            {label: tc('batchDelete'), value: 'delete'},
                        ]}
                    />
                    <Button type="primary" disabled={selectedItems.length === 0}
                            onClick={handleBatchAction}>{tc('apply')}</Button>
                    <Button type="primary" onClick={() => setIsPdfModalOpen(true)}>{t('generatePdf')}</Button>
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
            {
                isModalOpen && <ModalHaccpReport report={report} onClose={() => setIsModalOpen(false)}/>
            }
            {
                showSign && (
                    <Modal
                        title={t('signature')}
                        open={true}
                        width={560}
                        okText={tc('confirm')}
                        onCancel={() => setShowSign(false)}
                        okButtonProps={{
                            disabled: signatureData === '',
                        }}
                        onOk={handleSaveSign}
                    >
                        <div className={'flex flex-col gap-y-4 mb-4'}>
                            <p>{t('signInstruction')}</p>
                            <div className={'font-bold'}>{t('week')}: {filterParams.date}</div>
                            <div className={'font-bold'}>{t('recordType')}: {recordTypeName}</div>
                        </div>
                        <SignatureCanvas
                            style={{height: 300}}
                            onSignatureChange={(dataURL) => {
                                setSignatureData(dataURL);
                            }}
                        />
                    </Modal>
                )
            }
            {
                isPdfModalOpen && (
                    <Modal
                        title={t('generatePdf')}
                        open={true} footer={null} width={1200}
                        onCancel={() => setIsPdfModalOpen(false)}
                    >
                        <Form
                            layout={'vertical'}
                            initialValues={{
                                start_week: '2026-W01',
                                end_week: dayjs().format("YYYY-[W]WW"),
                                record_types: [],
                                image_options: ['include', 'rotate'],
                                introduction: '',
                                ...pdfOptions
                            }}
                            onFinish={handlePdfFormSubmit}
                        >
                            <Row gutter={10}>
                                <Col>
                                    <Form.Item label={t('dateStart')} name={'start_week'}>
                                        <Input type={'week'}/>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item label={t('dateEnd')} name={'end_week'}>
                                        <Input type={'week'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label={t('recordTypes')} name={'record_types'}>
                                <Checkbox.Group
                                    className={'flex-col gap-y-2'}
                                    options={reportTypes}
                                />
                            </Form.Item>
                            <Form.Item label={t('imageOptions')} name={'image_options'}>
                                <Checkbox.Group
                                    className={'flex-col gap-y-2'}
                                    options={[
                                        {
                                            label: t('includeImages'),
                                            value: 'include',
                                        },
                                        {
                                            label: t('rotateVerticalImages'),
                                            value: 'rotate',
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label={t('reportIntroduction')} name={'introduction'}>
                                <RichTextEditor height={200}/>
                            </Form.Item>
                            <Form.Item>
                                <div className={'flex justify-end gap-x-4'}>
                                    <Button onClick={() => setIsPdfModalOpen(false)}>{tc('cancel')}</Button>
                                    <Button type={'primary'} htmlType="submit" loading={loading}>{t('generate')}</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                )
            }
        </>
    )
}