import {Card, Descriptions, Modal, Table} from "antd";

const ModalHaccpReport = ({report = {}, onClose}: { report: any, onClose: () => void }) => {
    const {data: reportData} = report;
    return (
        <Modal open={true} footer={false} width={1200} title={report.type_text} onCancel={() => onClose?.()}>
            {
                report.type === 'delivery_record' && (
                    <Descriptions
                        items={[
                            {
                                key: 'Supplier',
                                label: 'Supplier',
                                children: reportData.supplier
                            },
                            {
                                key: 'Product',
                                label: 'Product',
                                children: reportData.product
                            },
                            {
                                key: 'temprature',
                                label: 'Temp (°C)',
                                children: reportData.temprature
                            },
                            {
                                key: 'vehicle_check',
                                label: 'Vehicle Check',
                                children: reportData.vehicle_check
                            },
                            {
                                key: 'Images',
                                label: 'Images',
                                children: () => (
                                    <span>
                                        {
                                            reportData.certificate && (
                                                <img
                                                    src={reportData.certificate}
                                                    alt="certificate"
                                                    className={'w-25 h-25 object-cover'}
                                                />
                                            )
                                        }
                                    </span>
                                )
                            }
                        ]}
                    />
                )
            }

            {
                report.type === 'cooking_record' && (
                    <>
                        <Card title={'Prepare'}>
                            <Table
                                columns={[
                                    {
                                        title: 'Food',
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Start',
                                        dataIndex: 'start',
                                        key: 'start',
                                    },
                                    {
                                        title: 'Finish',
                                        dataIndex: 'finish',
                                        key: 'finish',
                                    },
                                    {
                                        title: 'Temp(℃)',
                                        dataIndex: 'temp',
                                        key: 'temp',
                                    },
                                    {
                                        title: 'Cool Start',
                                        dataIndex: 'cool_start',
                                        key: 'cool_start',
                                    },
                                    {
                                        title: 'Cool Finish',
                                        dataIndex: 'cool_finish',
                                        key: 'cool_finish',
                                    },
                                    {
                                        title: 'Cool Temp(℃)',
                                        dataIndex: 'cool_temp',
                                        key: 'cool_temp',
                                    }
                                ]}
                                dataSource={reportData.prepare}
                                pagination={false}
                                bordered={true}
                                rowKey={(record: any) => record.name}
                            />
                        </Card>
                        <div className={'h-4'}></div>
                        <Card title={'Reheat'}>
                            <Table
                                columns={[
                                    {
                                        title: 'Food',
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Temp 1(℃)',
                                        dataIndex: 'temp1',
                                        key: 'temp1',
                                    },
                                    {
                                        title: 'Temp 2(℃)',
                                        dataIndex: 'temp2',
                                        key: 'temp2',
                                    },
                                    {
                                        title: 'Temp 3(℃)',
                                        dataIndex: 'temp3',
                                        key: 'temp3',
                                    },
                                ]}
                                dataSource={reportData.reheat}
                                pagination={false}
                                bordered={true}
                                rowKey={(record: any) => record.name}
                            />
                        </Card>
                        <div className={'h-4'}></div>
                        <Card title={'Reheat'}>
                            <Table
                                columns={[
                                    {
                                        title: 'Food',
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Temp 1(℃)',
                                        dataIndex: 'temp1',
                                        key: 'temp1',
                                    },
                                    {
                                        title: 'Temp 2(℃)',
                                        dataIndex: 'temp2',
                                        key: 'temp2',
                                    },
                                    {
                                        title: 'Temp 3(℃)',
                                        dataIndex: 'temp3',
                                        key: 'temp3',
                                    },
                                ]}
                                dataSource={reportData.raw}
                                pagination={false}
                                bordered={true}
                                rowKey={(record: any) => record.name}
                            />
                        </Card>
                    </>
                )
            }

            {
                report.type === 'cleaning_counter' && (
                    <div className={'flex flex-col gap-4'}>
                        {
                            reportData.counters?.map((unit: any) => (
                                <Card key={unit.name} title={unit.name}>
                                    <Table
                                        columns={[
                                            {
                                                title: 'Unit Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                title: 'Status',
                                                dataIndex: 'Value',
                                                key: 'Value',
                                                width: 100,
                                                render: (value: any) => {
                                                    return <span dangerouslySetInnerHTML={{__html: value ? '✅' : '❌'}}/>
                                                }
                                            }
                                        ]}
                                        dataSource={unit.items}
                                        pagination={false}
                                        bordered={true}
                                        rowKey={(record: any) => record.name}
                                    />
                                </Card>
                            ))
                        }
                    </div>
                )
            }

            {
                report.type === 'cleaning_chefs' && (
                    <div className={'flex flex-col gap-4'}>
                        {
                            reportData.chefs?.map((unit: any) => (
                                <Card key={unit.name} title={unit.name}>
                                    <Table
                                        columns={[
                                            {
                                                title: 'Unit Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                title: 'Status',
                                                dataIndex: 'Value',
                                                key: 'Value',
                                                width: 100,
                                                render: (value: any) => {
                                                    return <span dangerouslySetInnerHTML={{__html: value ? '✅' : '❌'}}/>
                                                }
                                            }
                                        ]}
                                        dataSource={unit.items}
                                        pagination={false}
                                        bordered={true}
                                        rowKey={(record: any) => record.name}
                                    />
                                </Card>
                            ))
                        }
                    </div>
                )
            }

            {
                report.type === 'cleaning_porters' && (
                    <div className={'flex flex-col gap-4'}>
                        {
                            reportData.porters?.map((unit: any) => (
                                <Card key={unit.name} title={unit.name}>
                                    <Table
                                        columns={[
                                            {
                                                title: 'Unit Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                title: 'Status',
                                                dataIndex: 'Value',
                                                key: 'Value',
                                                width: 100,
                                                render: (value: any) => {
                                                    return <span dangerouslySetInnerHTML={{__html: value ? '✅' : '❌'}}/>
                                                }
                                            }
                                        ]}
                                        dataSource={unit.items}
                                        pagination={false}
                                        bordered={true}
                                        rowKey={(record: any) => record.name}
                                    />
                                </Card>
                            ))
                        }
                    </div>
                )
            }

            {
                report.type === 'temperature_record' && (
                    <div className={'flex flex-col gap-4'}>
                        {
                            Object.entries(reportData).map(([name, unit]: [string, any]) => (
                                <Card key={name} title={name}>
                                    <Table
                                        columns={[
                                            {
                                                title: 'Unit Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                title: 'AM Temp (℃)',
                                                dataIndex: 'temp_am',
                                                key: 'temp_am',
                                                width: 200,
                                            },
                                            {
                                                title: 'PM Temp (℃)',
                                                dataIndex: 'temp_pm',
                                                key: 'temp_pm',
                                                width: 200,
                                            }
                                        ]}
                                        dataSource={unit}
                                        pagination={false}
                                        bordered={true}
                                        rowKey={(record: any) => record.name}
                                    />
                                </Card>
                            ))
                        }
                    </div>
                )
            }
            <div className={'h-4'}></div>
            <Card title={'Signature'}>
                <img src={report.signature} alt={'Signature'} className={'w-[300px] object-cover'}/>
            </Card>
        </Modal>
    );
};

export default ModalHaccpReport;