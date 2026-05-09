'use client'
import {Button, Card, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {apiGet, apiPost} from "@/lib/backendApi";
import {useMessage} from "@/contexts/BackendAppContext";
import {ArrowLeftOutlined} from "@ant-design/icons";

export default function Page() {
    const message = useMessage();
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<any[]>([]);
    const [staffs, setStaffs] = useState<any[]>([]);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [weeks, setWeeks] = useState(0);

    const fetchSchedules = () => {
        apiGet(`/staff/shifts`, {weeks}).then(response => {
            //console.log(response.data);
            setDates(response.data.dates);
            setStaffs(response.data.staffs);
            setDateStart(response.data.date_start);
            setDateEnd(response.data.date_end);
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSubmit = () => {
        console.log('staffs', staffs);
        const newShifts = staffs.map((staff: any) => {
            return staff.shifts.map((shift: any) => {
                if (shift.time_range) {
                    return {
                        staff_id: staff.id,
                        date: shift.date,
                        start_time: shift.start_time,
                        end_time: shift.end_time,
                        notes: shift.notes,
                    };
                }

                return {
                    staff_id: staff.id,
                    date: shift.date,
                    start_time: "",
                    end_time: "",
                    notes: shift.notes,
                };
            });
        });

        apiPost(`/staff/shifts`, {staffs: newShifts}).then(_ => {
            message.success('数据保存成功');
        }).catch(reason => {
            message.error(reason.message);
        }).finally(() => {

        })
    }

    const handleCopyLastWeek = () => {
        setLoading(true);
        apiPost(`/staff/shifts/copy-last-week`, {weeks}).then(() => {
            message.success("Last Week Data Copied!");
            fetchSchedules();
        }).catch((reason) => {
            message.error(reason.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchSchedules();
    }, [weeks]);
    return (
        <>
            <h2 style={{marginBottom: 24, fontSize: 24, fontWeight: 'bold'}}>员工排班</h2>
            <Card>
                <div className={'flex justify-between items-center mb-4'}>
                    <Button color={'cyan'} variant={'outlined'} onClick={() => setWeeks(prevState => prevState - 1)}>«
                        Previous Week</Button>
                    <div className={'flex flex-col justify-center items-center'}>
                        <div>{dateStart} ~ {dateEnd}</div>
                        <div>
                            <Button color={'cyan'} variant={'filled'} onClick={handleCopyLastWeek}>Copy Last
                                Week</Button>
                        </div>
                    </div>
                    <Button color={'cyan'} variant={'outlined'} onClick={() => setWeeks(prevState => prevState + 1)}>Next
                        Week »</Button>
                </div>
                <table className={'w-full border-collapse border border-gray-200 rounded-sm!'}>
                    <thead>
                    <tr>
                        <th className={'bg-[#fafafa] py-2 min-w-20'}>Name</th>
                        {
                            dates.map(d => (
                                <th key={d.date}
                                    className={`${d.is_holiday ? 'bg-red-200' : 'bg-[#fafafa]'} py-2 text-center border border-gray-200`}>
                                    <div className={'font-bold'}>{d.day_name}</div>
                                    <div className={'text-gray-500'}>{d.date}</div>
                                    {
                                        d.is_holiday && (
                                            <div className={'font-bold'}>{d.holiday_name}</div>
                                        )
                                    }
                                </th>
                            ))
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        staffs.map((staff: any, index) => (
                            <tr key={`staff-${staff.id}`}>
                                <td className={'border border-gray-200 font-bold p-2'}>
                                    <div>{staff?.name}</div>
                                    <Tag
                                        color={staff.signature ? 'success' : 'warning'}>{staff.signature ? 'Signed' : 'Unsigned'}</Tag>
                                </td>
                                {
                                    staff.shifts.map((shift: any, idx: number) => (
                                        <td key={`staff-${staff.id}-${shift.date}`}
                                            className={'p-2 border border-gray-200 text-center'}>
                                            <div className={'flex flex-col justify-center items-center'}>
                                                <input
                                                    type={'time'}
                                                    className={'border border-gray-300 py-1 px-2 rounded-sm w-full'}
                                                    value={shift.start_time || ''}
                                                    onChange={e => {
                                                        setStaffs(prevState => prevState.map((s, i) => {
                                                            if (i === index) {
                                                                return {
                                                                    ...s,
                                                                    shifts: s.shifts.map((sh: any, j: number) => {
                                                                        return j === idx ? {
                                                                            ...sh,
                                                                            start_time: e.target.value
                                                                        } : sh;
                                                                    })
                                                                }
                                                            }
                                                            return s;
                                                        }));
                                                    }}
                                                />
                                                <input
                                                    type={'time'}
                                                    className={'border border-gray-300 py-1 px-2 rounded-sm w-full'}
                                                    value={shift.end_time || ''}
                                                    onChange={e => {
                                                        setStaffs(prevState => prevState.map((s, i) => {
                                                            if (i === index) {
                                                                return {
                                                                    ...s,
                                                                    shifts: s.shifts.map((sh: any, j: number) => {
                                                                        return j === idx ? {
                                                                            ...sh,
                                                                            end_time: e.target.value
                                                                        } : sh;
                                                                    })
                                                                }
                                                            }
                                                            return s;
                                                        }));
                                                    }}
                                                />
                                                <input
                                                    type={'text'}
                                                    className={'border border-gray-300 py-1 px-2 rounded-sm w-full'}
                                                    value={shift.notes || ''}
                                                    onChange={e => {
                                                        setStaffs(prevState => prevState.map((s, i) => {
                                                            if (i === index) {
                                                                return {
                                                                    ...s,
                                                                    shifts: s.shifts.map((sh: any, j: number) => {
                                                                        return j === idx ? {
                                                                            ...sh,
                                                                            notes: e.target.value
                                                                        } : sh;
                                                                    })
                                                                }
                                                            }
                                                            return s;
                                                        }));
                                                    }}
                                                />
                                                <div>
                                                    <Button
                                                        type={'link'}
                                                        icon={<ArrowLeftOutlined/>}
                                                        onClick={() => {
                                                            if (idx > 0) {
                                                                const shift = staff.shifts[idx - 1];
                                                                setStaffs(prevState => prevState.map((s, i) => {
                                                                    if (i === index) {
                                                                        return {
                                                                            ...s,
                                                                            shifts: s.shifts.map((sh: any, j: number) => {
                                                                                return j === idx ? {
                                                                                    ...sh,
                                                                                    start_time: shift.start_time,
                                                                                    end_time: shift.end_time,
                                                                                    notes: shift.notes
                                                                                } : sh;
                                                                            })
                                                                        }
                                                                    }
                                                                    return s;
                                                                }));
                                                            } else {
                                                                message.error('No previous shift data');
                                                            }
                                                        }}
                                                    >Copy</Button>
                                                </div>
                                            </div>
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <div className={'mt-4 flex items-center justify-center'}>
                    <Button type={'primary'} onClick={handleSubmit}>Save All</Button>
                </div>
            </Card>
        </>
    );
}
