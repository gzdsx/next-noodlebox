import {Button, Card, Descriptions, Form, Input, Modal, Select, Spin, Table} from "antd";
import {apiGet, apiPost} from "@/lib/backendApi";
import {useEffect, useState} from "react";
import {useMessage} from "@/contexts/BackendAppContext";

const ModalDriverReport = ({driver, onClose}: { driver: any, onClose: () => void }) => {
    const message = useMessage();
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);

    const report = driver.report || {};
    const fetchOrders = () => {
        apiGet(`/deliveryers/${driver.id}/unsettledorders`).then(response => {
            setOrders([...response.data.items]);
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleSubmit = (values: any) => {
        setSubmiting(true);
        apiPost(`/deliveryers/${driver.id}/settlement`, values).then(() => {
            onClose();
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setSubmiting(false);
        });
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Modal
            title={'Driver Report'}
            open={true}
            onCancel={onClose}
            width={'80%'}
            loading={loading}
            footer={false}
        >
            <Spin spinning={submiting}>
                <div className={'flex flex-col gap-y-4'}>
                    <Card>
                        <Table
                            dataSource={orders}
                            rowKey={record => record.id}
                            columns={[
                                {
                                    key: 'short_code',
                                    title: 'Order No',
                                    dataIndex: 'short_code',
                                },
                                {
                                    key: 'shipping_zone',
                                    title: 'Shippng Zone',
                                    dataIndex: 'shipping_zone',
                                },
                                {
                                    key: 'shipping_total',
                                    title: 'Shipping Total',
                                    dataIndex: 'shipping_total',
                                },
                                {
                                    key: 'cost_total',
                                    title: 'Cost Fee',
                                    dataIndex: 'cost_total',
                                },
                                {
                                    key: 'total',
                                    title: 'Total',
                                    dataIndex: 'total',
                                },
                                {
                                    key: 'payment_method_title',
                                    title: 'Payment Method',
                                    dataIndex: 'payment_method_title',
                                }
                            ]}
                        />
                    </Card>
                    <Card>
                        <Descriptions
                            items={[
                                {
                                    key: 'base_amount',
                                    label: 'Base Amount',
                                    children: report.base_amount,
                                },
                                {
                                    label: 'Shipping Total',
                                    key: 'shipping_total',
                                    children: report.shipping_total,
                                },
                                {
                                    label: 'Online Total',
                                    key: 'online_total',
                                    children: report.online_total,
                                },
                                {
                                    label: 'Cash Total',
                                    key: 'cash_total',
                                    children: report.cash_total,
                                },
                                {
                                    label: 'Card Total',
                                    key: 'card_total',
                                    children: report.card_total,
                                },
                                {
                                    label: 'Cost Total',
                                    key: 'cost_total',
                                    children: report.cost_total,
                                },
                                {
                                    label: 'Order Total',
                                    key: 'total',
                                    children: report.total,
                                },
                                {
                                    label: 'Actual Total',
                                    key: 'actual_total',
                                    children: report.actual_total,
                                },
                            ]}
                        />
                    </Card>
                    <Card>
                        <Form className={'flex flex-row gap-x-4'} onFinish={handleSubmit}>
                            <Form.Item label={'Status'} name={'status'}>
                                <Select
                                    className={'w-30!'}
                                    options={[
                                        {
                                            label: 'Settled',
                                            value: 'settled'
                                        },
                                        {
                                            label: 'Pending',
                                            value: 'pending'
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label={'Notes'} name={'notes'}>
                                <Input className={'w-160!'}/>
                            </Form.Item>
                            <Button type={'primary'} htmlType={'submit'} disabled={submiting}>Submit</Button>
                        </Form>
                    </Card>
                </div>
            </Spin>
        </Modal>
    );
};

export default ModalDriverReport;