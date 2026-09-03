'use client'

import {Button, Card, Checkbox, Col, DatePicker, Form, Row} from "antd";
import {useState} from "react";
import {apiPost} from "@/lib/backendApi";
import {useMessage} from "@/contexts/BackendAppContext";
import dayjs from "dayjs";

export default function Page() {
    const message = useMessage();
    const [loading, setLoading] = useState(false);
    const handleExport = (values: any) => {
        console.log(values);
        const {created_types, dateRange} = values;
        if (!dateRange) {
            message.error('Please select date range');
            return;
        }
        const [date_start, date_end] = dateRange;
        if (date_start && date_end) {
            setLoading(true);
            apiPost('/orders/taxation', {
                date_start: dayjs(date_start).format('YYYY-MM-DD'),
                date_end: dayjs(date_end).format('YYYY-MM-DD'),
                created_types: created_types || []
            }).then((response) => {
                window.open(response.data.url);
            }).catch(reason => {
                message.error(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }
    return (
        <Card title={'Tax Report'}>
            <Form labelCol={{span: 2}} onFinish={handleExport}>
                <Form.Item label="Date Range" name="dateRange">
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item label="Created Via" name="created_types">
                    <Checkbox.Group options={[
                        {label: 'Web', value: 'web'},
                        {label: 'App', value: 'app'},
                        {label: 'POS', value: 'pos'},
                        {label: 'AI', value: 'ai'},
                    ]}/>
                </Form.Item>
                <Row>
                    <Col span={2}></Col>
                    <Col>
                        <Button type={'primary'} htmlType="submit" loading={loading} disabled={loading}>Export</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}