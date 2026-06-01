'use client';

import {useEffect, useState} from "react";
import {apiGet} from "@/lib/backendApi";
import {useMessage} from "@/contexts/BackendAppContext";
import {Card, Modal, Table} from "antd";

const ModalStaffSchedules = ({staff, onClose}: { staff: any, onClose: () => void }) => {
    const message = useMessage();
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchSchedules = () => {
        apiGet(`/staff/staffs/${staff.id}/schedules`, {offset, limit: 10}).then(response => {
            const {total, items} = response.data;
            setSchedules(items);
            setTotal(total);
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchSchedules();
    }, [offset]);

    return (
        <Modal
            title={`${staff.name}'s Schedules`}
            open={true}
            onCancel={onClose}
            footer={false}
            width={'80%'}
        >
            <Card loading={loading}>
                <Table
                    dataSource={schedules}
                    columns={[
                        {
                            title: 'Date',
                            dataIndex: 'date',
                            key: 'date',
                        },
                        {
                            title: 'Start Time',
                            dataIndex: 'start_time',
                            key: 'start_time',
                        },
                        {
                            title: 'End Time',
                            dataIndex: 'end_time',
                            key: 'end_time',
                        },
                        {
                            title: 'Notes',
                            dataIndex: 'notes',
                            key: 'notes',
                        },
                    ]}
                    rowKey={record => record.id}
                    pagination={{
                        total,
                        pageSize: 10,
                        showSizeChanger: false,
                        onChange: (page) => {
                            setOffset((page - 1) * 10);
                        }
                    }}
                />
            </Card>
        </Modal>
    );
};

export default ModalStaffSchedules;