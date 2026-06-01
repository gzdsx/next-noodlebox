'use client';

import {Button, Card, DatePicker, Descriptions, Modal, Table, Tag} from "antd";
import {apiGet} from "@/lib/backendApi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const ModelStaffInspection = ({staff, onClose}: { staff: any, onClose: () => void }) => {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [leaves, setLeaves] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInspections = () => {
        Promise.all([
            apiGet(`/staff/staffs/${staff.id}/leaves`, {year}),
            apiGet(`/staff/staffs/${staff.id}/shifts`, {year})
        ]).then((responses) => {
            setLeaves([...responses[0].data.items]);
            setShifts([...responses[1].data.items]);
        }).catch(reason => {
            console.log(reason.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleExportPdf = () => {
        apiGet(`/staff/staffs/${staff.id}/export`, {year}).then(response => {
            window.open(response.data.url);
        });
    }

    useEffect(() => {
        fetchInspections();
    }, [year]);

    return (
        <Modal
            open={true}
            title={`Timesheets & Signatures`}
            onCancel={onClose}
            footer={false}
            width={'80%'}
            loading={loading}
        >
            <div className={'flex flex-col gap-y-4 pt-6'}>
                <Card
                    title={'Employee Profiles'}
                    extra={
                        <Button type={'primary'} onClick={handleExportPdf}>Export PDF</Button>
                    }
                >
                    <Descriptions
                        items={[
                            {
                                key: 'Name',
                                label: 'Name',
                                children: staff.name,
                            },
                            {
                                key: 'phone_number',
                                label: 'Telephone',
                                children: staff.phone_number || 'N/A',
                            },
                            {
                                key: 'email',
                                label: 'Email',
                                children: staff.email || 'N/A',
                            },
                            {
                                key: 'pps_number',
                                label: 'PPS Number',
                                children: staff.pps_number || 'N/A',
                            },
                            {
                                key: 'start_date',
                                label: 'Start Date',
                                children: staff.start_date || 'N/A',
                            },
                            {
                                key: 'hourly_rate',
                                label: 'Hourly Rate',
                                children: staff.hourly_rate ? '€' + staff.hourly_rate : 'N/A',
                            },
                            {
                                key: 'id_file_url',
                                label: 'ID Document',
                                children: staff.id_file_url ? <a href={staff.id_file_url} target={'_blank'} className={'text-blue-400!'}>View</a>: 'N/A',
                            },
                            {
                                key: 'contract_file_url',
                                label: 'Contract Document',
                                children: staff.contract_file_url ? <a href={staff.contract_file_url} target={'_blank'} className={'text-blue-400!'}>View</a>: 'N/A',
                            },
                            {
                                key: 'address',
                                label: 'Address',
                                children: staff.address || 'N/A',
                            }
                        ]}
                    />
                </Card>
                <Card
                    title={'Weekly Hours & Pay History'}
                    extra={
                        <DatePicker picker={'year'} defaultValue={dayjs(year)} onChange={(value) => {
                            if (value) {
                                setYear(value.format('YYYY'));
                            }
                        }}/>
                    }
                >
                    <Table
                        dataSource={shifts}
                        columns={[
                            {
                                title: 'Week Start',
                                dataIndex: 'week_start',
                                key: 'week_start',
                            },
                            {
                                title: 'Hourly Rate',
                                dataIndex: 'hourly_rate',
                                key: 'hourly_rate',
                                render: (value) => {
                                    return `€${value}`;
                                }
                            },
                            {
                                title: 'Total Hours',
                                dataIndex: 'working_hours',
                                key: 'working_hours',
                            },
                            {
                                title: 'Est. Gross Pay',
                                dataIndex: 'gross_pay',
                                key: 'gross_pay',
                                render: (value) => {
                                    return `€${value}`;
                                }
                            },
                            {
                                title: 'Signature',
                                dataIndex: 'signature',
                                key: 'signature',
                                render: (value) => (
                                    <>
                                        {
                                            value ? (
                                                <img src={value} style={{width: 90}} alt={'Sign'}/>
                                            ) : (
                                                <Tag></Tag>
                                            )
                                        }
                                    </>
                                )
                            }
                        ]}
                        pagination={false}
                        rowKey={record => record.week_start}
                    />
                </Card>

                <Card title={'Leave History'}>
                    <Table
                        dataSource={leaves}
                        columns={[
                            {
                                title: 'Start Date',
                                dataIndex: 'start_date',
                                key: 'start_date',
                            },
                            {
                                title: 'End Date',
                                dataIndex: 'end_date',
                                key: 'end_date'
                            },
                            {
                                title: 'Type',
                                dataIndex: 'type',
                                key: 'type',
                            },
                            {
                                title: 'Reason',
                                dataIndex: 'reason',
                                key: 'reason'
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status'
                            }
                        ]}
                        pagination={false}
                        rowKey={record => record.id}
                    />
                </Card>
            </div>
        </Modal>
    );
};

export default ModelStaffInspection;